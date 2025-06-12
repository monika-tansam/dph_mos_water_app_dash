import express from 'express';
import forgotPasswordController from '../controllers/forgotPasswordController.js';

const router = express.Router();

router.post('/', forgotPasswordController.handleForgotPassword);
router.post('/verify', forgotPasswordController.verifyOTP);

export default router;
