import { User } from "../backend-app/user-model-app/user.model.js";
import bcrypt from "bcryptjs";
import { createTokenAndSetCookie } from "../utils-app/token.js";
import { sendVerificationEmail, sendWelcomeEmail } from "./mailtrap-app/emailController.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(`Registering user with username: ${username}, email: ${email}`);
    if (!username || !email || !password) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const ifUserExists = await User.findOne({ email });
    if (ifUserExists) {
      return res.status(400).send({ message: "User already exists" });
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
    createTokenAndSetCookie(res, newUser);
    res
      .status(201)
      .send({
        message: "User registered successfully",
        success: true,
        user: { ...newUser._doc },
      });
  } catch (error) {
    console.log(`Error during registration: ${error.message}`);
    res
      .status(500)
      .send({ message: `Error during registration: ${error.message}` });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, verificationToken } = req.body;
    const user = await User.findOne({ email });
    console.log(
      `Verifying email for user: ${user}, token: ${verificationToken}`
    );

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    if (user.verificationToken !== verificationToken || user.verificationTokenExpiresAt < new Date()) {
      return res.status(400).send({ message: "Invalid or expired verification token" });
    }
    user.isVerified = true;
    user.verificationToken = undefined; // Clear the verification token after successful verification  
    user.verificationTokenExpiresAt = undefined; // Clear the expiration date
    await user.save();
    await sendWelcomeEmail(user);
    console.log(`Email verified for user: ${email}`);
    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    console.error(`Error verifying email: ${error.message}`);
    res
      .status(500)
      .send({ message: `Error verifying email: ${error.message}` });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(
      `Login attempt with username: ${username}, password: ${password}`
    );
    if (username === "admin" && password === "password") {
      res.status(200).send({ message: "Login successful" });
    } else {
      res.status(401).send({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    // Simulate logout logic
    res.status(200).send({ message: "Logout successful" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};
