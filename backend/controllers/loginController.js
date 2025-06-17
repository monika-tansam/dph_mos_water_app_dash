//import validateCaptcha from './captchaController.js';

import pool from '../utils/db.js';

const handleLogin = async (req, res) => {
    const { username, password } = req.body;

    const users = [
        { username: 'karthi@example.com', password: 'Nodejs@123' }
    ];
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        return res.status(200).json({ message: 'Admin login successful!' });
    }
    
    try {
        const result = await pool.query(
        'SELECT * FROM district_officer_table WHERE username = $1 AND password = $2',
        [username, password]
        );

        if (result.rows.length > 0) {
            res.json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export default { handleLogin };
// This code handles the login functionality for the application.