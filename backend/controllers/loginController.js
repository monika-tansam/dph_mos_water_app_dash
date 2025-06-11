const { validateCaptcha } = require('./captchaController');

const users = [
    { userId: 'karthi@example.com', password: 'nodejs123' },
    { userId: 'admin@example.com', password: 'admin@123' }
];

const handleLogin = (req, res) => {
    const { userId, password, captcha } = req.body;

    if (!userId || !password || !captcha) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    if (!validateCaptcha(captcha)) {
        return res.status(401).json({ message: 'Invalid captcha.' });
    }

    const user = users.find(u => u.userId === userId && u.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid userId or password.' });
    }

    return res.status(200).json({ message: 'Login successful!' });
};

module.exports = { handleLogin };
