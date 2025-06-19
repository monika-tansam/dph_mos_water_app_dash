// loginController.js (SQLite version)

import db from '../utils/db.js';

const handleLogin = (req, res) => {
    const { username, password } = req.body;

    const users = [
        { username: 'karthi@example.com', password: 'Nodejs@123' }
    ];
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        return res.status(200).json({ message: 'Admin login successful!' });
    }

    try {
        const stmt = db.prepare('SELECT * FROM district_officer_table WHERE user_id = ? AND password = ?');
        const result = stmt.get(username, password);

        if (result) {
            const userData = {
                user_id: result.user_id,
                username: result.username,
                phone_number: result.phone_number,
                address: result.address,
                aadhar_number: result.aadhar_number,
                status: result.status,
            };

            return res.json({ message: 'Login successful', user: userData });


        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const addDistrictOfficer = async (req, res) => {
    console.log("Incoming addDistrictOfficer request body:", req.body);  // 👈 LOG this
    const { user_id, username, password, district_name, phone_number, address, aadhar_number, status } = req.body;
console.log("Received values:", {
  user_id, username, password, district_name, phone_number, address, aadhar_number, status
});

    try {
        const districtResult = db.prepare(
            'SELECT district_code FROM district_table WHERE district_name = ?'
        ).get(district_name);

        if (!districtResult) {
            console.log("Invalid district name:", district_name);  // 👈 LOG
            return res.status(400).json({ message: 'Invalid district name' });
        }

        const district_code = districtResult.district_code;

        db.prepare(`
            INSERT INTO district_officer_table 
                (user_id, username, password, district_code, phone_number, address, aadhar_number, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(user_id, username, password, district_code, phone_number, address, aadhar_number, status);

        return res.status(201).json({
            user_id,
            username,
            district_name,
            phone_number,
            address,
            aadhar_number,
            status,
            password
        });

    } catch (err) {
        console.error("Server error:", err);
        return res.status(500).json({ message: 'Server error' });
    }
};


const editDistrictOfficer = (req, res) => {
    const { user_id, username, password, district_name, phone_number, address, aadhar_number, status } = req.body;

    try {
        const districtStmt = db.prepare('SELECT district_code FROM district_table WHERE district_name = ?');
        const districtResult = districtStmt.get(district_name);

        if (!districtResult) {
            return res.status(400).json({ message: 'Invalid district name' });
        }

        const district_code = districtResult.district_code;

        const updateStmt = db.prepare(`
            UPDATE district_officer_table
            SET password = ?,
                district_code = ?,
                phone_number = ?,
                address = ?,
                aadhar_number = ?,
                status = ?,
                username = ?
            WHERE user_id = ?
        `);

        const info = updateStmt.run(password, district_code, phone_number, address, aadhar_number, status, username, user_id);

        if (info.changes === 0) {
            return res.status(404).json({ message: 'District officer not found' });
        }

        return res.status(200).json({ message: 'District officer updated successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

export default { handleLogin, addDistrictOfficer, editDistrictOfficer };