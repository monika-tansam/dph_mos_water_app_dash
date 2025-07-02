// loginController.js (SQLite version)
import db from '../utils/db.js';
import bcrypt from 'bcryptjs';


const handleLogin = (req, res) => {
const username = req.body.username || req.body.user_id;
const { password } = req.body;


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

    // ✅ NEW: Chlorination data collector
    const collector = db.prepare(`
      SELECT * FROM chlorination_data_collectors
      WHERE username = ? OR user_id = ?
    `).get(username, username);

    if (collector && bcrypt.compareSync(password, collector.hashedPassword || collector.password)) {
      return res.status(200).json({
        message: 'chlorination data_collector login successful',
        user: {
          user_id: collector.user_id,
          username: collector.username,
          Email: collector.email,
          phone_number: collector.phone_number,
          role: 'data_collector',
          module: 'chlorination',
          hub_id: collector.hub_id,
          hub_name: collector.hub_name,
          status: 'active'
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



export default { handleLogin };
