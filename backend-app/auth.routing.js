import express from 'express';
import { login, register, logout, verifyEmail } from './auth.controller.js';

const routing = express.Router();

routing.post('/login', login);

routing.post('/register', register);

routing.post('/logout', logout);

routing.post('/verify-email', verifyEmail);
export default routing;
