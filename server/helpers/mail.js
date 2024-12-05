import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

transporter.verify(function (error, success) {
  if (error) {
    console.log('SMTP Error:', error);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});

function canSendEmail(lastEmailSent, isEmailVerified) {
  if (!isEmailVerified) return true;
  
  if (!lastEmailSent) return true;
  
  const cooldownPeriod = 15 * 60 * 1000; 
  const timeSinceLastEmail = Date.now() - new Date(lastEmailSent).getTime();
  
  return timeSinceLastEmail >= cooldownPeriod;
}

async function sendVerificationEmail(userId, email, firstName, fromLogin = false) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (!canSendEmail(user.lastEmailSent, user.isEmailVerified)) {
      const timeLeft = Math.ceil((15 * 60 * 1000 - (Date.now() - new Date(user.lastEmailSent).getTime())) / 60000);
      throw new Error(`Please wait ${timeLeft} minutes before requesting another verification email`);
    }
    
    const verificationToken = jwt.sign(
      { id: userId, email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}${fromLogin ? '&from=login' : ''}`;

    const mailOptions = {
      from: `"LocalEase" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email - LocalEase',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 40px; font-family: 'Outfit', Arial, sans-serif; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #6C63FF; font-size: 32px; font-weight: 700; margin: 0;">Welcome to LocalEase!</h1>
            <p style="color: #9B9B9B; font-size: 16px; margin-top: 10px;">Your Local Service Finder</p>
          </div>
          <p style="color: #4A4A4A; font-size: 18px; margin-bottom: 20px;">Hello ${firstName},</p>
          <p style="color: #4A4A4A; font-size: 16px; line-height: 1.6;">Thank you for joining LocalEase! To get started, please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 35px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #6C63FF; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 16px; font-weight: 600; transition: background-color 0.3s ease;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #4A4A4A; font-size: 14px; background-color: #F8F9FA; padding: 15px; border-radius: 6px; margin: 25px 0;">⚠️ This verification link will expire in 1 hour for security purposes.</p>
          <p style="color: #4A4A4A; font-size: 14px;">If you didn't create an account with LocalEase, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #E8E8E8; margin: 30px 0;">
          <div style="text-align: center;">
            <p style="color: #9B9B9B; font-size: 12px; margin: 0;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        </div>
      `
    };

    await transporter.verify();
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
  
    user.lastEmailSent = new Date();
    await user.save();

    return verificationToken;
  } catch (error) {
    console.error('Error in sendVerificationEmail:', error);
    throw error;
  }
}

export { sendVerificationEmail, canSendEmail, transporter };
