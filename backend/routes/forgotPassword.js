const express = require('express');
const router = express.Router();
const {
    handleForgotPassword,
    verifyOTP
} = require('../controllers/forgotPasswordController');

router.post('/', handleForgotPassword);
router.post('/verify', verifyOTP);

module.exports = router;
