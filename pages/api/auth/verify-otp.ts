import type { NextApiRequest, NextApiResponse } from 'next';
import User from '../../../models/User';
import { dbConnect } from '../../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { otp } = req.body;
    const sessionCookie = req.cookies.session;
    const pendingAuth = req.cookies['pending-auth'];

    if (!sessionCookie || !pendingAuth) {
      return res.status(401).json({ error: 'No pending authentication found' });
    }

    const sessionData = JSON.parse(sessionCookie);
    const { userId } = sessionData;

    // Check if this is a temporary session (database not available)
    if (userId.startsWith('temp-')) {
      // For temporary sessions, just complete the authentication
      const authData = {
        userId: userId,
        email: sessionData.email,
        name: sessionData.name,
        picture: sessionData.picture,
        isAdmin: sessionData.isAdmin,
        isVerified: true
      };

      res.setHeader('Set-Cookie', [
        `auth-token=${JSON.stringify(authData)}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`,
        `session=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`,
        `pending-auth=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`
      ]);

      res.status(200).json({ 
        success: true, 
        user: {
          id: userId,
          email: sessionData.email,
          name: sessionData.name,
          picture: sessionData.picture,
          isAdmin: sessionData.isAdmin
        }
      });
      return;
    }

    // Normal database flow
    await dbConnect();

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if OTP is expired
    if (!user.otpExpiry || new Date() > user.otpExpiry) {
      return res.status(400).json({ error: 'OTP has expired' });
    }

    // Verify OTP
    if (user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Set authentication cookies
    const authData = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      picture: user.picture,
      isAdmin: user.isAdmin,
      isVerified: true
    };

    res.setHeader('Set-Cookie', [
      `auth-token=${JSON.stringify(authData)}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`,
      `session=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`,
      `pending-auth=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`
    ]);

    res.status(200).json({ 
      success: true, 
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        isAdmin: user.isAdmin
      }
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
} 