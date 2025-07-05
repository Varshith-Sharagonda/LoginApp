import express from "express";
import {
  login,
  register,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "./auth.controller.js";

const routing = express.Router();

routing.post("/login", login);

routing.post("/register", register);

routing.post("/logout", logout);

routing.post("/verify-email", verifyEmail);

routing.post("/forgot-password", forgotPassword);

routing.post("/reset-password/:token", resetPassword);

export default routing;
