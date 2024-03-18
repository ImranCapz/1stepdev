import express from 'express';
import { google, signin, signup, signout } from '../controllers/auth.controller.js';
import { resetPassword, verifyOtpPassword } from "../controllers/auth.controller.js";
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google);
router.get('/signout', signout);
router.post('/otppassword',resetPassword);
router.post('/verifyOtp', verifyOtpPassword);

export default router;