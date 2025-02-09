import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Verify email domain
    if (!email.endsWith('@srmap.edu.in')) {
      return NextResponse.json(
        { error: 'Invalid email domain. Please use your SRM AP email.' },
        { status: 400 }
      );
    }

    // Email template
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'SRM AP Connect - Email Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0f172a;">Verify Your Email</h2>
          <p>Hello,</p>
          <p>Your verification code for SRM AP Connect is:</p>
          <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="color: #0f172a; letter-spacing: 5px; font-size: 32px; margin: 0;">${otp}</h1>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <p style="margin-top: 30px; font-size: 12px; color: #64748b;">
            This is an automated message, please do not reply.
          </p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP email' },
      { status: 500 }
    );
  }
} 