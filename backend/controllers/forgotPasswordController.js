const sendOTPEmail = require('../utils/sendMail');

const users = [
    { userId: 'karthi@example.com', password: 'nodejs123' }
];

// Generate 6-digit numeric OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Step 1: Forgot Password - Generate OTP
const handleForgotPassword = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    const user = users.find(u => u.userId === userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    const otp = generateOTP();
    req.session.otpData = {
        otp,
        userId,
        createdAt: Date.now()
    };

    try {
        await sendOTPEmail('karthikeyan.ravi1127@gmail.com', otp); // send to userId (email)
        res.status(200).json({ message: 'OTP sent to your email.' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to send OTP email.' });
    }
};

// Step 2: Verify OTP
const verifyOTP = (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res.status(400).json({ message: 'User ID and OTP are required.' });
    }

    const otpData = req.session.otpData;

    if (!otpData || otpData.userId !== userId) {
        return res.status(401).json({ message: 'Invalid or expired OTP.' });
    }

    const isExpired = (Date.now() - otpData.createdAt) > 2 * 60 * 1000; // 2 min
    if (isExpired) {
        return res.status(410).json({ message: 'OTP has expired.' });
    }

    if (otpData.otp !== otp) {
        return res.status(401).json({ message: 'Invalid OTP.' });
    }

    // Optionally clear OTP from session
    delete req.session.otpData;

    res.status(200).json({ message: 'OTP verified successfully!' });
};

module.exports = {
    handleForgotPassword,
    verifyOTP
};
