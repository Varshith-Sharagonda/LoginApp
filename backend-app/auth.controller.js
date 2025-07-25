import { User } from '../backend-app/user-model-app/user.model.js';
import bcrypt from 'bcryptjs';
import { generateAuthTokenAndSetCookie } from '../utils-app/token.js';
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail,
} from './mailtrap-app/emailController.js';
import crypto from 'crypto';

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).send({ message: 'All fields are required' });
    }

    const ifUserExists = await User.findOne({ email });
    if (ifUserExists) {
      return res.status(400).send({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      verificationToken,
      verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Token valid for 24 hours
    });
    await newUser.save();
    sendVerificationEmail(email, verificationToken);
    generateAuthTokenAndSetCookie(res, newUser);
    res.status(201).send({
      message: 'User registered successfully',
      success: true,
      user: { ...newUser._doc },
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: `Error during registration: ${error.message}` });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, verificationToken } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    if (
      user.verificationToken !== verificationToken ||
      user.verificationTokenExpiresAt < new Date()
    ) {
      return res
        .status(400)
        .send({ message: 'Invalid or expired verification token' });
    }
    user.isVerified = true;
    user.verificationToken = undefined; // Clear the verification token after successful verification
    user.verificationTokenExpiresAt = undefined; // Clear the expiration date
    await user.save();
    await sendWelcomeEmail(user);
    res.status(200).send({ message: 'Email verified successfully' });
  } catch (error) {
    console.error(`Error verifying email: ${error.message}`);
    res
      .status(500)
      .send({ message: `Error verifying email: ${error.message}` });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .send({ message: 'email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: 'Invalid password' });
    }
    generateAuthTokenAndSetCookie(res, user);
    user.lastLogin = new Date();
    await user.save();
    res.status(200).send({
      message: 'Login successful',
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(500).send({ message: `Error during login: ${error.message}` });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('token');
    res.status(200).send({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).send({ message: `Error during logout: ${error.message}` });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send({ success: false, message: 'Email is required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ success: false, message: 'Invalid email. User not found' });
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();
    await sendPasswordResetEmail(email, resetToken);
    res.status(200).send({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: `Error during password reset: ${error.message}` });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!password) {
      return res.status(400).send({ success: false, message: 'New password is required' });
    }
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: new Date() },
    });
    if (!user) {
      return res.status(404).send({ success: false, message: 'Invalid or expired token' });
    }
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();
    await sendPasswordResetSuccessEmail(user.email);
    res.status(200).send({ success: true, message: 'Password reset successful' });
  } catch (error) {
    res.status(500).send({ success: false, message: `Error resetting password: ${error.message}` });
  }
};

export const protectRoute = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).send({ success: false, message: 'Unauthorized access' });
    }
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).send({ success: false, message: 'User not found' });
    }
    res.status(200).send({ success: true, message: 'Protected route accessed', user: { ...user._doc } });
  } catch (error) {
    res.status(400).send({ success: false, message: `Error protecting route: ${error.message}` });
  }
};