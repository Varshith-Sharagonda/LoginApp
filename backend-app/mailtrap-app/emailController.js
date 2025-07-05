import { sender, transport } from './config.js';
import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from './emailTemplates.js';
import dotenv from 'dotenv';
dotenv.config();
export const sendVerificationEmail = async (email, verificationCode) => {
  try {
    const mailOptions = {
      from: sender,
      to: email,
      subject: 'Verify Your Email',
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        '{verificationCode}',
        verificationCode
      ),
      category: 'Email Verification',
    };

    await transport.sendMail(mailOptions);
  } catch (error) {
    console.error(`Error sending verification email: ${error.message}`);
  }
};

export const sendWelcomeEmail = async (user) => {
  try {
    const mailOptions = {
      from: sender,
      to: user.email,
      subject: 'Email Verification Successful',
      html: `<p>Welcome to our service! ${user.username}</p>
            <p>Thank you for verifying your email address.</p>
            <p>Best regards,</p>
            <p>The Auth Team</p>`,
    };

    await transport.sendMail(mailOptions);
  } catch (error) {
    console.error(`Error sending welcome email: ${error.message}`);
  }
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const mailOptions = {
      from: sender,
      to: email,
      subject: 'Password Reset Request',
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(
        '{resetURL}',
        `${process.env.RESET_PASSWORD_URL}/reset-password?token=${resetToken}`
      ),
      category: 'Password Reset',
    };

    await transport.sendMail(mailOptions);
  } catch (error) {
    console.error(`Error sending password reset email: ${error.message}`);
  }
};

export const sendPasswordResetSuccessEmail = async (email) => {
  try {
    const mailOptions = {
      from: sender,
      to: email,
      subject: 'Password Reset Successful',
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: 'Password Reset',
    };

    await transport.sendMail(mailOptions);
  } catch (error) {
    console.error(`Error sending password reset success email: ${error.message}`);
  }
};  
