import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
export async function sendOTPEmail(email: string, otp: string, name: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Brainstack Education - Email Verification',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #0a0a23 0%, #23234b 100%); padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: white; margin-bottom: 20px;">Brainstack Education</h1>
          <div style="background-color: white; padding: 30px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #333; margin-bottom: 15px;">Email Verification</h2>
            <p style="color: #666; margin-bottom: 20px;">Hi ${name},</p>
            <p style="color: #666; margin-bottom: 20px;">Your verification code is:</p>
            <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h1 style="color: #1976d2; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
            </div>
            <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
            <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
          </div>
          <p style="color: #ccc; font-size: 12px; margin-top: 20px;">© 2023 Brainstack Education. All rights reserved.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

// Send resend OTP email
export async function sendResendOTPEmail(email: string, otp: string, name: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Brainstack Education - New Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #0a0a23 0%, #23234b 100%); padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: white; margin-bottom: 20px;">Brainstack Education</h1>
          <div style="background-color: white; padding: 30px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #333; margin-bottom: 15px;">New Verification Code</h2>
            <p style="color: #666; margin-bottom: 20px;">Hi ${name},</p>
            <p style="color: #666; margin-bottom: 20px;">Your new verification code is:</p>
            <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h1 style="color: #1976d2; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
            </div>
            <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
            <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
          </div>
          <p style="color: #ccc; font-size: 12px; margin-top: 20px;">© 2023 Brainstack Education. All rights reserved.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
} 