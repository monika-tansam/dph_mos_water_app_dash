// loginController.js (SQLite version)
import db from '../utils/db.js';
import bcrypt from 'bcryptjs';


const handleLogin = (req, res) => {
  const { username, password } = req.body;

  // 🔐 Hardcoded users for all roles
  const hardcodedUsers = [
    {
      username: 'karthi@example.com',
      password: 'Nodejs@123',
      role: 'mos_admin',
      module: 'mosquito'
    },
    {
      user_id: 'DO123',
      username: 'dofficer@example.com',
      password: 'Mosq@123',
      role: 'district_user',
      module: 'mosquito',
      district_name: 'Chennai',
      status: 'active'
    },
    {
      user_id: 'BLK456',
      username: 'blockuser@example.com',
      password: 'Block@123',
      role: 'block_user',
      module: 'mosquito',
      district_name: 'Madurai',
      status: 'active'
    },
    {
      user_id: 'CHL789',
      username: 'chladmin@example.com',
      password: 'Chlorine@123',
      role: 'chl_admin',
      module: 'chlorination',
      hub_id: 'HUB001',
      status: 'active'
    }
  ];

  // 🔍 Check hardcoded credentials first
  const matched = hardcodedUsers.find(
    // user => user.username === username && user.password === password
     user => (user.username === username || user.user_id === username) && user.password === password
  );

  if (matched) {
    return res.status(200).json({
      message: `${matched.module} ${matched.role} login successful`,
      user: {
        user_id: matched.user_id || null,
        username: matched.username,
        role: matched.role,
        module: matched.module,
        district_name: matched.district_name || null,
        hub_id: matched.hub_id || null,
        status: matched.status || 'active'
      }
    });
  }

  try {
    // ✅ Try DB: Mosquito District Officer
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

const chlUser = db.prepare(`
  SELECT * FROM chlorination_hub_users
  WHERE username = ? OR user_id = ?
`).get(username, username);


if (chlUser && bcrypt.compareSync(password, chlUser.hashedPassword || chlUser.password)) {
  return res.status(200).json({
    message: `${chlUser.module} ${chlUser.role} login successful`,
    user: {
      user_id: chlUser.user_id,
      username: chlUser.username,
      role: chlUser.role,
      module: chlUser.module,
      hub_id: chlUser.hub_id,
      status: chlUser.status
    }
  });
}

    // ❌ Invalid credentials
    res.status(401).json({ message: 'Invalid credentials' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const addDistrictOfficer = async (req, res) => {
  console.log("Incoming addDistrictOfficer request body:", req.body);
  const { user_id, username, password, district_name, phone_number, address, aadhar_number, status } = req.body;

  try {
    const districtResult = db.prepare(
      'SELECT district_code FROM district_table WHERE district_name = ?'
    ).get(district_name);

    if (!districtResult) {
      console.log("Invalid district name:", district_name);
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
