import pool from '../utils/db.js';

const getDashboardData = async (req, res) => {
    const { username } = req.body;
    const adminUser = [
        { username: 'karthi@example.com', password: 'nodejs123' }
    ];
    const user = adminUser.find(u => u.username === username);
    if(user){
        try {
            const result = await pool.query('SELECT * FROM datacollection');
            return res.json(result.rows);
        } 
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
        }
    }
    else{
        return res.status(403).json({ message: 'Access denied. Admin credentials required.' });
    }
    
};

const getDistrictData = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM district_table');
        return res.json(result.rows);
    } 
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const getDistrictOfficers = async (req, res) => {
    try {
        const query = `
            SELECT 
                d_off.user_id,
                d_off.username,
                d_off.district_code,
                d_off.status,
                d.district_name,
                d_off.password,
                d_off.phone_number,
                d_off.address,
                d_off.aadhar_number
            FROM 
                district_officer_table d_off
            JOIN 
                district_table d
            ON 
                d_off.district_code = d.district_code
        `;
        const result = await pool.query(query);
        return res.json(result.rows);
    } 
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const addDataCollection = async (req, res) => {
    const { user_id, username, district_name, geolocation, date, time, user_geolocation, image_base64 } = req.body; // Replace with your actual fields
    try {
        const result = await pool.query(
            'INSERT INTO datacollection (user_id, username, district_name, geolocation, date, time, user_geolocation, image_base64) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [user_id, username, district_name, geolocation, date, time, user_geolocation, image_base64]
        );
        return res.status(201).json({ message: 'Data inserted successfully' });
    } 
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

export default { getDashboardData, getDistrictData, getDistrictOfficers, addDataCollection };