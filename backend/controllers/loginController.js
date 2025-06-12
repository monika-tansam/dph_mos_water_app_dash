//import validateCaptcha from './captchaController.js';

const users = [
    { username: 'karthi@example.com', password: 'Nodejs@123' },
    { username: 'admin@example.com', password: 'admin@123' }
];

const handleLogin = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password ) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // if (!validateCaptcha(captcha)) {
    //     return res.status(401).json({ message: 'Invalid captcha.' });
    // }

    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password.' });
    }

    return res.status(200).json({ message: 'Login successful!' });
};

export default { handleLogin };
