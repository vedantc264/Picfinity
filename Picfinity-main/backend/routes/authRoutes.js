import { Router } from 'express';
import {
  signup,
  login,
  me,
  forgotPassword,
  verifyOtp,
  changePassword
} from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';
import { validateLogin, validateSignup } from '../middleware/validate.js';

const router = Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.get('/me', authMiddleware, me);
router.post('/forgotPassword', forgotPassword);
router.post('/verifyOTP', verifyOtp);
router.post('/changePassword', changePassword);

export default router;
