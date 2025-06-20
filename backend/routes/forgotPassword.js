import express from 'express';
import forgotPasswordController from '../controllers/forgotPasswordController.js';

const router = express.Router();

router.post('/', forgotPasswordController.handleForgotPassword);
router.post('/verify', forgotPasswordController.verifyOTP);
router.post('/reset-password', forgotPasswordController.resetPassword);

export default router;
