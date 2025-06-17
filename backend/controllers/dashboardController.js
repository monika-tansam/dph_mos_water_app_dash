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
                d.district_name
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

export default { getDashboardData, getDistrictData, getDistrictOfficers };