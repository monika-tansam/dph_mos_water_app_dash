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
        'SELECT * FROM district_officer_table WHERE user_id = $1 AND password = $2',
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

const addDistrictOfficer = async (req, res) => {
    const { user_id, username, password, district_name, phone_number, address, aadhar_number, status } = req.body;

    try {
        // Get district_code from district_table using district name
        const districtResult = await pool.query(
            'SELECT district_code FROM district_table WHERE district_name = $1',
            [district_name]
        );

        if (districtResult.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid district name' });
        }

        const district_code = districtResult.rows[0].district_code;

        // Insert new district officer
        await pool.query(
            `INSERT INTO district_officer_table 
                ( username, password, district_code, phone_number, address, aadhar_number, status, user_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [ username, password, district_code, phone_number, address, aadhar_number, status, user_id]
        );

        return res.status(201).json({ message: 'District officer added successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const editDistrictOfficer = async (req, res) => {
    const { user_id, username, password, district_name, phone_number, address, aadhar_number, status } = req.body;

    try {
        // Get district_code from district_table using district name
        const districtResult = await pool.query(
            'SELECT district_code FROM district_table WHERE district_name = $1',
            [district_name]
        );

        if (districtResult.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid district name' });
        }

        const district_code = districtResult.rows[0].district_code;

        // Update district officer details using user_id
        const updateResult = await pool.query(
            `UPDATE district_officer_table
             SET password = $1,
                 district_code = $2,
                 phone_number = $3,
                 address = $4,
                 aadhar_number = $5,
                 status = $6,
                 username = $7
             WHERE user_id = $8`,
            [password, district_code, phone_number, address, aadhar_number, status, username, user_id]
        );

        if (updateResult.rowCount === 0) {
            return res.status(404).json({ message: 'District officer not found' });
        }

        return res.status(200).json({ message: 'District officer updated successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};


export default { handleLogin, addDistrictOfficer, editDistrictOfficer };
// This code handles the login functionality for the application.