import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import session from "express-session";
import flash from "connect-flash";
import bcrypt from "bcryptjs";
import { db } from "../db.js";
import dotenv from "dotenv";
import crypto from 'crypto'
import * as authController from '../controllers/authController.js';

const router = express.Router();




// routes/authRoutes.js (Final Clean Version)






router.get("/signup", authController.getSignupPage);
router.post("/signup", authController.handleSignup);

router.get("/login", authController.getLoginPage);
router.post("/login", authController.handleLogin);

router.get("/fpassword", authController.getForgotPasswordPage);
router.post("/fpassword", authController.handleForgotPassword);

router.get("/rpassword", authController.getResetPasswordPage);
router.post("/rpassword", authController.handleResetPassword);

// Routes will go here

export default router;

 
