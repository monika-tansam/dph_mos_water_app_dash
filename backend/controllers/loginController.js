// loginController.js (SQLite version)

import db from '../utils/db.js';

const handleLogin = (req, res) => {
    const { username, password } = req.body;

  // 1. Super Admin (hardcoded)
  const adminUsers = [
    { username: 'karthi@example.com', password: 'Nodejs@123', role: 'mos_admin', module: 'mosquito' }
  ];
  const admin = adminUsers.find(u => u.username === username && u.password === password);
  if (admin) {
    return res.status(200).json({
      message: 'Mosquito admin login successful',
      user: {
        username: admin.username,
        role: admin.role,
        module: admin.module
      }
    });
  }

  try {
    // 2. Try Mosquito District Officer
    const mosquitoUser = db.prepare(`
      SELECT u.*, d.district_name FROM district_officer_table u
      JOIN district_table d ON u.district_code = d.district_code
      WHERE u.user_id = ? AND u.password = ?
    `).get(username, password);

    if (mosquitoUser) {
      return res.status(200).json({
        message: 'Mosquito district officer login successful',
        user: {
          user_id: mosquitoUser.user_id,
          username: mosquitoUser.username,
          role: 'district_user',
          module: 'mosquito',
          district_name: mosquitoUser.district_name,
          status: mosquitoUser.status
        }
      });
    }

    // 3. Try Chlorination Users
    const chlUser = db.prepare(`
      SELECT * FROM chlorination_users
      WHERE user_id = ? AND password = ?
    `).get(username, password);

    if (chlUser) {
      return res.status(200).json({
        message: 'Chlorination login successful',
        user: {
          user_id: chlUser.user_id,
          username: chlUser.username,
          role: chlUser.role,
          module: 'chlorination',
          hub_id: chlUser.hub_id,
          status: chlUser.status
        }
      });
    }

    // Invalid credentials
    res.status(401).json({ message: 'Invalid credentials' });

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