import type { NextApiRequest, NextApiResponse } from 'next';
import { oauth2Client, isAdminEmail } from '../../../../lib/googleAuth';
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
          isVerified: true // Mark as verified immediately
        });
      } else {
        // Update existing user info
        user.name = name;
        user.picture = picture;
        user.googleId = googleId;
        user.lastLogin = new Date();
        user.isVerified = true; // Mark as verified
      }

      await user.save();

      // Store user info in session
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
    }

    // Set authentication cookies and redirect to home
    res.setHeader('Set-Cookie', [
      `session=${JSON.stringify(sessionData)}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`, // 24 hours
      `authenticated=true; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`
    ]);

    // Redirect to home page (already authenticated)
    res.redirect('/');

  } catch (error) {
    console.error('Google callback error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
} 