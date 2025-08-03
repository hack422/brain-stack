import type { NextApiRequest, NextApiResponse } from 'next';
import { generateOTP, sendResendOTPEmail } from '../../../lib/emailService';
import User from '../../../models/User';
import { dbConnect } from '../../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sessionCookie = req.cookies.session;
    const pendingAuth = req.cookies['pending-auth'];

    if (!sessionCookie || !pendingAuth) {
      return res.status(401).json({ error: 'No pending authentication found' });
    }

    const sessionData = JSON.parse(sessionCookie);
    const { userId, email, name } = sessionData;

    // Check if this is a temporary session (database not available)
    if (userId.startsWith('temp-')) {
      // For temporary sessions, just send a new email
      const newOtp = generateOTP();
      const emailSent = await sendResendOTPEmail(email, newOtp, name);

      if (!emailSent) {
        return res.status(500).json({ error: 'Failed to send verification email' });
      }

      res.status(200).json({ success: true, message: 'New OTP sent successfully' });
      return;
    }

    // Normal database flow
    await dbConnect();

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate new OTP
    const newOtp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = newOtp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send new OTP email
    const emailSent = await sendResendOTPEmail(email, newOtp, name);

    if (!emailSent) {
      return res.status(500).json({ error: 'Failed to send verification email' });
    }

    res.status(200).json({ success: true, message: 'New OTP sent successfully' });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ error: 'Failed to resend OTP' });
  }
} 