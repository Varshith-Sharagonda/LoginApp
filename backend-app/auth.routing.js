import express from 'express';
import {
  login,
  register,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  protectRoute,
} from './auth.controller.js';
import { authenticateToken } from '../utils-app/token.js';

const routing = express.Router();

routing.post('/login', login);

routing.post('/register', register);

routing.post('/logout', logout);

routing.post('/verify-email', verifyEmail);

routing.post('/forgot-password', forgotPassword);

routing.post('/reset-password/:token', resetPassword);

routing.get('/verify-auth', authenticateToken, protectRoute);

export default routing;
