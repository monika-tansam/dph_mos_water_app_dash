// controllers/dashboardController.js
import db from '../utils/db.js';
import fs from 'fs';
import path from 'path';

export const getDashboardData = (req, res) => {
  const { username } = req.body;
  const adminUser = [
    { username: 'karthi@example.com', password: 'nodejs123' }
  ];
  const user = adminUser.find(u => u.username === username);
  if (user) {
    try {
      const stmt = db.prepare('SELECT * FROM datacollection');
      const result = stmt.all();
      return res.json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  } else {
    return res.status(403).json({ message: 'Access denied. Admin credentials required.' });
  }
};

export const getDistrictData = (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM district_table');
    const result = stmt.all();
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getDistrictOfficers = (req, res) => {
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
    const stmt = db.prepare(query);
    const result = stmt.all();
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const addDataCollection = (req, res) => {
    console.log('Incoming body:', req.body);

  try {
    const {
      user_id,
      username,
      district_name,
      areaType,
      geolocation,
      date,
      time,
      user_geolocation,
      image_base64, // base64 image string
    } = req.body;

    if (!user_id || !username) {
      return res.status(400).json({ message: 'Missing user_id or username' });
    }

    const geo = typeof geolocation === 'string' ? JSON.parse(geolocation) : geolocation;
    const userGeo = typeof user_geolocation === 'string' ? JSON.parse(user_geolocation) : user_geolocation;

    let imagePath = '';
    if (image_base64) {
      const buffer = Buffer.from(image_base64, 'base64');
      const filename = `image-${Date.now()}.jpg`;
      const dir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);
      imagePath = path.join('uploads', filename);
      fs.writeFileSync(path.join(process.cwd(), imagePath), buffer);
    }

    const stmt = db.prepare(`
      INSERT INTO datacollection
        (user_id, username, district_name, areaType, geolocation, date, time, user_geolocation, image_base64)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      user_id,
      username,
      district_name,
      areaType,
      JSON.stringify(geo),
      date,
      time,
      JSON.stringify(userGeo),
      imagePath // saved path to image file
    );

    return res.status(201).json({ message: 'Data inserted successfully' });
} catch (err) {
  console.error('addDataCollection error:', err);
  return res.status(500).json({ message: err.message || 'Server error' });
}

};

export default {
  getDashboardData,
  getDistrictData,
  getDistrictOfficers,
  addDataCollection
};