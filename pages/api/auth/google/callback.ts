import type { NextApiRequest, NextApiResponse } from 'next';
import { oauth2Client, isAdminEmail } from '../../../../lib/googleAuth';
import { generateOTP, sendOTPEmail } from '../../../../lib/emailService';
import User from '../../../../models/User';
import { dbConnect } from '../../../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Authorization code is required' });
  }

  try {
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      throw new Error('Failed to get user info from Google');
    }

    const userInfo = await userInfoResponse.json();
    const { email, name, picture, id: googleId } = userInfo;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    let sessionData;
    let emailSent = false;

    try {
      // Try to connect to database
      await dbConnect();

      // Check if user exists
      let user = await User.findOne({ email });

      if (!user) {
        // Create new user
        user = new User({
          email,
          name,
          picture,
          googleId,
          isAdmin: isAdminEmail(email),
          isVerified: false
        });
      } else {
        // Update existing user info
        user.name = name;
        user.picture = picture;
        user.googleId = googleId;
        user.lastLogin = new Date();
      }

      // Generate and send OTP
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      user.otp = otp;
      user.otpExpiry = otpExpiry;

      await user.save();

      // Send OTP email
      emailSent = await sendOTPEmail(email, otp, name);

      // Store user info in session for OTP verification
      sessionData = {
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin
      };

    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // Fallback: Create temporary session without database
      sessionData = {
        userId: 'temp-' + Date.now(),
        email: email,
        name: name,
        isAdmin: isAdminEmail(email)
      };

      // Generate OTP and send email even without database
      const otp = generateOTP();
      emailSent = await sendOTPEmail(email, otp, name);
    }

    // Always set cookies and redirect, regardless of database status
    if (emailSent) {
      res.setHeader('Set-Cookie', [
        `session=${JSON.stringify(sessionData)}; HttpOnly; Path=/; Max-Age=600; SameSite=Strict`,
        `pending-auth=true; HttpOnly; Path=/; Max-Age=600; SameSite=Strict`
      ]);

      // Redirect to OTP verification page
      res.redirect('/verify-otp');
    } else {
      res.status(500).json({ error: 'Failed to send verification email' });
    }

  } catch (error) {
    console.error('Google callback error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
} 