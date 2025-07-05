import db from '../utils/db.js';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

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

export const addDistrictOfficer = async (req, res) => {
  const {
    username,
    password,
    district_code,
    phone_number,
    status = "Active"
  } = req.body;

  console.log("Incoming addDistrictOfficer request body:", req.body);

  // Basic validation
  if (!username || !password || !district_code) {
    return res.status(400).json({
      message: 'Username, password, and district code are required'
    });
  }

  try {
    // Get district info
    const district = db.prepare(`
      SELECT district_name FROM mosquito_district_master 
      WHERE district_code = ?
    `).get(district_code);
console.log("Matching district in DB:", district); 
    if (!district) {
      return res.status(400).json({ 
        message: 'Invalid district code',
        availableDistricts: db.prepare('SELECT district_code, district_name FROM mosquito_district_master').all()
      });
    }

    // Generate user_id (first 5 chars of district_code + sequential number)
    const count = db.prepare(`
      SELECT COUNT(*) as total FROM district_officer_table
      WHERE district_code = ?
    `).get(district_code);

    const prefix = district_code.substring(0, 5).toUpperCase();
    const user_id = `${prefix}${String(count.total + 1).padStart(3, '0')}`;

    // Validate phone number
    const cleanedPhone = phone_number ? phone_number.replace(/\D/g, '') : null;
    if (cleanedPhone && cleanedPhone.length < 10) {
      return res.status(400).json({ message: 'Phone number must be at least 10 digits' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check for existing username
    const existing = db.prepare(`
      SELECT username FROM district_officer_table 
      WHERE username = ?
    `).get(username);

    if (existing) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    // Insert new officer
    db.prepare(`
      INSERT INTO district_officer_table (
        user_id, username, password, district_code, district_name,
        phone_number, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      user_id,
      username,
      hashedPassword,
      district_code,
      district.district_name,
      cleanedPhone || null,
      status
    );

    return res.status(201).json({ 
      message: 'District officer added successfully',
      user_id,
      district_name: district.district_name
    });

  } catch (err) {
    console.error("addDistrictOfficer error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
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
    m.district_name,
    d_off.password,
    d_off.phone_number
  FROM 
    district_officer_table d_off
  JOIN 
    mosquito_district_master m
  ON 
    d_off.district_code = m.district_code
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
      image_base64
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
      imagePath = path.join('/uploads', filename);
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
      imagePath
    );

    return res.status(201).json({ message: 'Data inserted successfully' });
  } catch (err) {
    console.error('addDataCollection error:', err);
    return res.status(500).json({ message: err.message || 'Server error' });
  }
};

function generateHubId() {
  const existing = db.prepare(`SELECT hub_id FROM chlorination_hubs ORDER BY hub_id DESC LIMIT 1`).get();
  if (!existing) return 'HUB001';
  const lastId = parseInt(existing.hub_id.replace('HUB', ''));
  return `HUB${String(lastId + 1).padStart(3, '0')}`;
}

function generateDistrictCode(districtName, hub_id) {
  const prefix = districtName.trim().substring(0, 5).toUpperCase();

  const count = db.prepare(`
    SELECT COUNT(*) as total FROM chlorination_districts 
    WHERE hub_id = ?
  `).get(hub_id);

  const number = count.total + 1;
  return `${prefix}${String(number).padStart(3, '0')}`;
}




export const addChlorinationHub = (req, res) => {
  const { hub_name } = req.body;
  
  if (!hub_name) {
    return res.status(400).json({ message: 'Missing hub_name' });
  }

  try {
    const hub_id = generateHubId();
    const stmt = db.prepare(`INSERT INTO chlorination_hubs (hub_id, hub_name) VALUES (?, ?)`);
    stmt.run(hub_id, hub_name);
    return res.status(201).json({ message: 'Hub created successfully', hub_id });
  } catch (err) {
    console.error('addChlorinationHub error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const addChlorinationDistrict = (req, res) => {
  const { district_name, hub_id } = req.body;

  if (!district_name || !hub_id) {
    return res.status(400).json({ message: 'Missing district data' });
  }

  try {
    const district_code = generateDistrictCode(district_name, hub_id);
    const stmt = db.prepare(`
      INSERT INTO chlorination_districts (district_code, district_name, hub_id)
      VALUES (?, ?, ?)
    `);
    stmt.run(district_code, district_name, hub_id);
    return res.status(201).json({ message: 'District added successfully', district_code });
  } catch (err) {
    console.error('addChlorinationDistrict error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const getAllHubsWithDistricts = (req, res) => {
  try {
    const hubs = db.prepare(`SELECT * FROM chlorination_hubs`).all();
    const districts = db.prepare(`SELECT * FROM chlorination_districts`).all();

    const result = hubs.map(hub => ({
      ...hub,
      districts: districts.filter(d => d.hub_id === hub.hub_id)
    }));

    return res.json(result);
  } catch (err) {
    console.error('getAllHubsWithDistricts error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const createInspectionTester = (req, res) => {
  const { tester_name, hub_id } = req.body;

  if (!tester_name || !hub_id) {
    return res.status(400).json({ message: 'Missing tester_name or hub_id' });
  }

  try {
    const count = db.prepare(`
      SELECT COUNT(*) AS total FROM chlorination_inspection_testers WHERE hub_id = ?
    `).get(hub_id);

    if (count.total >= 4) {
      return res.status(400).json({ message: 'Maximum 4 testers allowed per hub' });
    }

    const tester_id = uuidv4();
    db.prepare(`
      INSERT INTO chlorination_inspection_testers (tester_id, tester_name, hub_id)
      VALUES (?, ?, ?)
    `).run(tester_id, tester_name, hub_id);

    return res.status(201).json({ message: 'Inspection tester created', tester_id });
  } catch (err) {
    console.error('createInspectionTester error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const addChlorinationUser = (req, res) => {
  const {
    username,
    email,
    password,
    hub_id,
    phone_number,
    address,
    status,
    role = 'hub_officer',
    module = 'chlorination'
  } = req.body;

  if (!username || !email || !password || !hub_id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const hub = db.prepare(`SELECT hub_name FROM chlorination_hubs WHERE hub_id = ?`).get(hub_id);

    if (!hub) {
      return res.status(400).json({ message: 'Invalid hub_id. No such hub exists.' });
    }

    const count = db.prepare(`SELECT COUNT(*) AS total FROM chlorination_hub_users WHERE hub_id = ?`).get(hub_id);
    const userNumber = String(count.total + 1).padStart(3, '0');
    const user_id = `${hub_id}USR${userNumber}`;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const stmt = db.prepare(`
      INSERT INTO chlorination_hub_users 
      (user_id, username, email, hashedPassword, hub_id, hub_name, phone_number, address, status, role, module)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(user_id, username, email, hashedPassword, hub_id, hub.hub_name, phone_number, address, status, role, module);

    return res.status(201).json({ message: 'User added successfully', user_id });
  } catch (err) {
    console.error('addChlorinationUser error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all chlorination hub users
export const getChlorinationUsers = (req, res) => {
  try {
    const stmt = db.prepare(`SELECT * FROM chlorination_hub_users`);
    const users = stmt.all();
    res.json(users);
  } catch (err) {
    console.error("getChlorinationUsers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const addChlorinationDataCollector = (req, res) => {
  const {
    username,
    email,
    password,
    hub_id,
    phone_number,
  } = req.body;

  // Basic validation
  if (!username || !email || !password || !hub_id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // ✅ Get hub name from hub_id
    const hub = db.prepare(`SELECT hub_name FROM chlorination_hubs WHERE hub_id = ?`).get(hub_id);
    if (!hub) {
      return res.status(400).json({ message: 'Invalid hub_id' });
    }
    // ✅ Count existing users under same hub
    const count = db.prepare(`
      SELECT COUNT(*) AS total 
      FROM chlorination_data_collectors 
      WHERE hub_id = ?
    `).get(hub_id);

    const hubPrefix = hub.hub_name.substring(0, 3).toUpperCase();
    const sequence = String(count.total + 1).padStart(3, '0');
    const user_id = `${hub_id}${hubPrefix}USE${sequence}`;
    const hashedPassword = bcrypt.hashSync(password, 10);
    // ✅ Insert user
    const stmt = db.prepare(`
      INSERT INTO chlorination_data_collectors 
      (user_id, username, email, hashedPassword, hub_id, hub_name, phone_number)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      user_id,
      username,
      email,
      hashedPassword,
      hub_id,
      hub.hub_name,
      phone_number
    );

    return res.status(201).json({ message: 'Data collector added successfully', user_id });
  } catch (err) {
    console.error('addChlorinationDataCollector error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getChlorinationDataCollectors = (req, res) => {
  try {
    const stmt = db.prepare(`SELECT * FROM chlorination_data_collectors`);
    const collectors = stmt.all();
    res.json(collectors);
  } catch (err) {
    console.error("getChlorinationDataCollectors error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const getChlorinationDataCollection = (req, res) => {
  try {
    const data = db.prepare(`SELECT * FROM chlorine_data_collection`).all();
    res.json({ data });
  } catch (err) {
    console.error('Failed to fetch chlorination data:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
export const getChlorineDataByHubId = (req, res) => {
  const { hub_id } = req.query;

  if (!hub_id) {
    return res.status(400).json({ message: "Hub ID is required" });
  }

  try {
    const stmt = db.prepare(
     `SELECT * FROM chlorine_data_collection WHERE UPPER(hub_id) = UPPER(?)`
    );
    const rows = stmt.all(hub_id);

    return res.status(200).json({ status: "success", data: rows });
  } catch (err) {
    console.error("getChlorineDataByHubId error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


function generateMosDistrictCode(district_name) {
  const prefix = district_name.trim().substring(0, 4).toUpperCase(); // First 4 letters
  const codePrefix = `MOS${prefix}`; // e.g., MOSCHEN

  // Count total number of rows in the table (not by prefix)
  const { total } = db.prepare(`SELECT COUNT(*) AS total FROM mosquito_district_master`).get();

  const nextNumber = String(total + 1).padStart(3, '0'); // Global 001, 002, ...
  return `${codePrefix}${nextNumber}`;
}

export const addMosquitoDistrict = (req, res) => {
  const { district_name } = req.body;

  if (!district_name) {
    return res.status(400).json({ message: 'District name is required' });
  }

  try {
    const district_code = generateMosDistrictCode(district_name);

    db.prepare(`
      INSERT INTO mosquito_district_master (district_code, district_name)
      VALUES (?, ?)
    `).run(district_code, district_name);

    return res.status(201).json({ message: 'District added', district_code });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ message: 'District already exists' });
    }
    console.error('addMosquitoDistrict error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getMosquitoDistricts = (req, res) => {
  try {
    const districts = db.prepare(`SELECT * FROM mosquito_district_master`).all();
    return res.json(districts);
  } catch (err) {
    console.error('getMosquitoDistricts error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Add this to your backend routes
// Add this to your existing backend routes file
export const getOfficerCount = (req, res) => {
  const { district } = req.query;
  
  if (!district) {
    return res.status(400).json({ message: 'District code is required' });
  }

  try {
    const result = db.prepare(`
      SELECT COUNT(*) as count FROM district_officer_table
      WHERE district_code = ?
    `).get(district);
    
    return res.json({ count: result.count });
  } catch (err) {
    console.error('Error getting officer count:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const addChlorineUserDataEntry = async (req, res) => {
  console.log("Incoming chlorine data:", req.body);
  try {
    const {
      ppm,
      base64Image,
      latitude,
      longitude,
      timestamp,
      user_id,
      username,
      hub_id,
      hub_name,
    } = req.body;

    if (!ppm || !base64Image || !latitude || !longitude || !timestamp) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Save image to disk
    const buffer = Buffer.from(base64Image, 'base64');
    const filename = `chlorine_image_${Date.now()}.jpg`;
    const dir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    const filePath = path.join(dir, filename);
    fs.writeFileSync(filePath, buffer);

    // Save record to DB
    const stmt = db.prepare(`
      INSERT INTO chlorine_data_collection 
      (ppm, image_path, latitude, longitude, timestamp, hub_id, hub_name, user_id, username)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(ppm, `/uploads/${filename}`, latitude, longitude, timestamp, hub_id, hub_name, user_id, username);

    return res.status(201).json({ message: 'Data stored successfully' });
  } catch (err) {
    console.error('addChlorineDataEntry error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Get districts under a specific hub
export const getChlorinationDistrictsByHub = (req, res) => {
  const { hub_id } = req.query;

  if (!hub_id) {
    return res.status(400).json({ error: 'Missing hub_id in query' });
  }

  try {
    const stmt = db.prepare(`
      SELECT district_code, district_name
      FROM chlorination_districts 
      WHERE hub_id = ?
    `);

    const results = stmt.all(hub_id); // Returns array of { district_code, district_name }

    res.json(results); // Send full objects

  } catch (err) {
    console.error("DB error fetching districts:", err);
    res.status(500).json({ error: "Database error" });
  }
};

export const addCorporationMaster = (req, res) => {
  const { hub_id, hub_name, district_id, district_name, corporation_name } = req.body;

  if (!hub_id || !hub_name || !district_id || !district_name || !corporation_name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO corporation_master 
        (hub_id, hub_name, district_id, district_name, corporation_name)
      VALUES (?, ?, ?, ?, ?)  
    `);

    const result = stmt.run(hub_id, hub_name, district_id, district_name, corporation_name);

    res.status(201).json({ message: "Corporation added", id: result.lastInsertRowid });
  } catch (err) {
    console.error("Error inserting corporation master:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// controllers/dashboardController.js
export const addMunicipalityMaster = (req, res) => {
  const { hub_id, hub_name, district_name, municipality_name } = req.body;

  if (!hub_id || !hub_name || !district_name || !municipality_name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO chlorination_municipality_master (hub_id, hub_name, district_name, municipality_name)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(hub_id, hub_name, district_name, municipality_name);

    res.status(201).json({ message: "Municipality added", id: result.lastInsertRowid });
  } catch (err) {
    console.error("Error inserting municipality:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMunicipalityMaster = (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT id, hub_id, hub_name, district_name, municipality_name
      FROM chlorination_municipality_master
    `);
    const rows = stmt.all();
    res.json(rows);
  } catch (err) {
    console.error("Error fetching municipalities:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add Town Panchayat
export const addTownPanchayatMaster = (req, res) => {
  const { hub_id, hub_name, district_name, townpanchayat_name } = req.body;

  console.log("Incoming Town Panchayat:", req.body); // Debug log

  if (!hub_id || !hub_name || !district_name || !townpanchayat_name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO chlorination_townpanchayat_master 
      (hub_id, hub_name, district_name, townpanchayat_name)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(hub_id, hub_name, district_name, townpanchayat_name);

    console.log("Inserted row ID:", result.lastInsertRowid); // ✅ Log insertion
    res.status(201).json({ message: "Town Panchayat added", id: result.lastInsertRowid });
  } catch (err) {
    console.error("Error inserting into townpanchayat_master:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Get All Town Panchayats
export const getTownPanchayatMaster = (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT * FROM chlorination_townpanchayat_master
    `);
    const rows = stmt.all();
    res.json(rows);
  } catch (err) {
    console.error("Error fetching town panchayats:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addGovernmentHospital = (req, res) => {
  const { hub_id, hub_name, district_name, hospital_name } = req.body;

  if (!hub_id || !hub_name || !district_name || !hospital_name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO chlorination_government_hospital_master
      (hub_id, hub_name, district_name, hospital_name)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(hub_id, hub_name, district_name, hospital_name);
    res.status(201).json({ message: "Hospital added", id: result.lastInsertRowid });
  } catch (err) {
    console.error("Error adding hospital:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getGovernmentHospitals = (req, res) => {
  try {
    const stmt = db.prepare(`SELECT * FROM chlorination_government_hospital_master`);
    const rows = stmt.all();
    res.json(rows);
  } catch (err) {
    console.error("Error fetching hospitals:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST /dashboard/railway-station-master
export const addRailwayStationMaster = (req, res) => {
  const { hub_id, hub_name, district_name, station_name } = req.body;

  if (!hub_id || !hub_name || !district_name || !station_name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO chlorination_railway_station_master 
      (hub_id, hub_name, district_name, station_name)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(hub_id, hub_name, district_name, station_name);
    res.status(201).json({ message: "Railway station added", id: result.lastInsertRowid });
  } catch (err) {
    console.error("Error adding railway station:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET /dashboard/railway-station-master
export const getRailwayStationMaster = (req, res) => {
  try {
    const stmt = db.prepare(`SELECT * FROM chlorination_railway_station_master`);
    const rows = stmt.all();
    res.json(rows);
  } catch (err) {
    console.error("Error fetching railway stations:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST /dashboard/railway-station-master
export const addApprovedHomesMaster = (req, res) => {
  const { hub_id, hub_name, district_name, approvedhome_name } = req.body;

  if (!hub_id || !hub_name || !district_name || !approvedhome_name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO chlorination_approved_home_master 
      (hub_id, hub_name, district_name, approvedhome_name)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(hub_id, hub_name, district_name, approvedhome_name);
    res.status(201).json({ message: "Approved home added", id: result.lastInsertRowid });
  } catch (err) {
    console.error("Error adding approved home:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET /dashboard/railway-station-master
export const getApprovedHomesMaster = (req, res) => {
  try {
    const stmt = db.prepare(`SELECT * FROM chlorination_approved_home_master `);
    const rows = stmt.all();
    res.json(rows);
  } catch (err) {
    console.error("Error fetching approved home:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addPrisonMaster = (req, res) => {
  const { hub_id, hub_name, district_name, prison_name } = req.body;

  if (!hub_id || !hub_name || !district_name || !prison_name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO chlorination_prison_master
      (hub_id, hub_name, district_name, prison_name)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(hub_id, hub_name, district_name, prison_name);
    res.status(201).json({ message: "Prison added", id: result.lastInsertRowid });
  } catch (err) {
    console.error("Error adding prison:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPrisonMaster = (req, res) => {
  try {
    const stmt = db.prepare("SELECT * FROM chlorination_prison_master");
    const rows = stmt.all();
    res.json(rows);
  } catch (err) {
    console.error("Error fetching prisons:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add new institution
export const addGovernmentInstitutionMaster = (req, res) => {
  const { hub_id, hub_name, district_name, institution_name } = req.body;

  if (!hub_id || !hub_name || !district_name || !institution_name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO chlorination_governmentinstitution_master 
      (hub_id, hub_name, district_name, institution_name)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(hub_id, hub_name, district_name, institution_name);
    res.status(201).json({ message: "Institution added", id: result.lastInsertRowid });
  } catch (err) {
    console.error("Error adding institution:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all institutions
export const getGovernmentInstitutionMaster = (req, res) => {
  try {
    const stmt = db.prepare(`SELECT * FROM chlorination_governmentinstitution_master`);
    const rows = stmt.all();
    res.json(rows);
  } catch (err) {
    console.error("Error fetching institutions:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// controllers/dashboardController.js

export const addEducationalInstitutionMaster = (req, res) => {
  const { hub_id, hub_name, district_name, institution_name } = req.body;

  if (!hub_id || !hub_name || !district_name || !institution_name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO chlorination_educationalinstitution_master 
      (hub_id, hub_name, district_name, institution_name)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(hub_id, hub_name, district_name, institution_name);
    res.status(201).json({ message: "Institution added", id: result.lastInsertRowid });
  } catch (err) {
    console.error("Error adding educational institution:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getEducationalInstitutionMaster = (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT * FROM chlorination_educationalinstitution_master
    `);
    const rows = stmt.all();
    res.json(rows);
  } catch (err) {
    console.error("Error fetching institutions:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add PWD entry
export const addPWDMaster = (req, res) => {
  const { hub_id, hub_name, district_name, pwd_name } = req.body;

  if (!hub_id || !hub_name || !district_name || !pwd_name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO chlorination_pwd_master 
      (hub_id, hub_name, district_name, pwd_name)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(hub_id, hub_name, district_name, pwd_name);
    res.status(201).json({ message: "PWD entry added", id: result.lastInsertRowid });
  } catch (err) {
    console.error("Error inserting PWD:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all PWD entries
export const getPWDMaster = (req, res) => {
  try {
    const stmt = db.prepare(`SELECT * FROM chlorination_pwd_master`);
    const rows = stmt.all();
    res.json(rows);
  } catch (err) {
    console.error("Error fetching PWD records:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addTempleFestival = (req, res) => {
  const { hub_id, hub_name, district_name, temple_name } = req.body;

  if (!hub_id || !hub_name || !district_name || !temple_name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO chlorination_templefestival_master 
      (hub_id, hub_name, district_name, temple_name)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(hub_id, hub_name, district_name, temple_name);
    res.status(201).json({ message: "Temple festival camp added", id: result.lastInsertRowid });
  } catch (err) {
    console.error("DB insert error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTempleFestivals = (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT * FROM chlorination_templefestival_master
    `).all();
    res.json(rows);
  } catch (err) {
    console.error("DB select error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getHubMasterData = async (req, res) => {
  try {
    const tables = [
      ['corporation_master', 'corporation'],
      ['chlorination_municipality_master', 'municipalities'],
      ['chlorination_townpanchayat_master', 'townPanchayats'],
      ['chlorination_government_hospital_master', 'govtHospitals'],
      ['chlorination_railway_station_master', 'railwayStations'],
      ['chlorination_approved_home_master', 'approvedHomes'],
      ['chlorination_prison_master', 'prisons'],
      ['chlorination_governmentinstitution_master', 'govtInstitutions'],
      ['chlorination_educationalinstitution_master', 'educationalInstitutions'],
      ['chlorination_pwd_master', 'pwdPoondi'],
      ['chlorination_templefestival_master', 'templeCamp'],
    ];

    const masterData = {};

    for (const [table, alias] of tables) {
      const stmt = db.prepare(
        `SELECT hub_id, district_name, COUNT(*) as ${alias} FROM ${table} GROUP BY hub_id, district_name`
      );
      const rows = stmt.all(); // <-- synchronous and works with better-sqlite3

      for (const row of rows) {
        const key = `${row.hub_id}_${row.district_name}`;
        if (!masterData[key]) {
          masterData[key] = {
            hub_id: row.hub_id,
            district: row.district_name,
            corporation: 0,
            municipalities: 0,
            townPanchayats: 0,
            govtHospitals: 0,
            railwayStations: 0,
            approvedHomes: 0,
            prisons: 0,
            govtInstitutions: 0,
            educationalInstitutions: 0,
            pwdPoondi: 0,
            templeCamp: 0,
            cycle1Status: "In Progress",
            cycle2Status: "In Progress",
          };
        }
        masterData[key][alias] = row[alias];
      }
    }

    const rows = Object.values(masterData).map((entry, index) => ({
      id: index + 1,
      ...entry,
      total:
        entry.corporation +
        entry.municipalities +
        entry.townPanchayats +
        entry.govtHospitals +
        entry.railwayStations +
        entry.approvedHomes +
        entry.prisons +
        entry.govtInstitutions +
        entry.educationalInstitutions +
        entry.pwdPoondi +
        entry.templeCamp,
    }));

    res.json(rows);
  } catch (error) {
    console.error("Error in getHubMasterData:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const refreshHubMasterData = async (req, res) => {
  try {
    const tables = [
      ['corporation_master', 'corporation'],
      ['chlorination_municipality_master', 'municipalities'],
      ['chlorination_townpanchayat_master', 'townPanchayats'],
      ['chlorination_government_hospital_master', 'govtHospitals'],
      ['chlorination_railway_station_master', 'railwayStations'],
      ['chlorination_approved_home_master', 'approvedHomes'],
      ['chlorination_prison_master', 'prisons'],
      ['chlorination_governmentinstitution_master', 'govtInstitutions'],
      ['chlorination_educationalinstitution_master', 'educationalInstitutions'],
      ['chlorination_pwd_master', 'pwdPoondi'],
      ['chlorination_templefestival_master', 'templeCamp'],
    ];

    const masterData = {};

    for (const [table, alias] of tables) {
      const stmt = db.prepare(
        `SELECT hub_id, hub_name, district_name, COUNT(*) as ${alias} FROM ${table} GROUP BY hub_id, hub_name, district_name`
      );
      const rows = stmt.all();

      for (const row of rows) {
        const key = `${row.hub_id}_${row.district_name}`;
        if (!masterData[key]) {
          masterData[key] = {
            hub_id: row.hub_id,
            hub_name: row.hub_name,
            district: row.district_name,
            corporation: 0,
            municipalities: 0,
            townPanchayats: 0,
            govtHospitals: 0,
            railwayStations: 0,
            approvedHomes: 0,
            prisons: 0,
            govtInstitutions: 0,
            educationalInstitutions: 0,
            pwdPoondi: 0,
            templeCamp: 0,
          };
        }
        masterData[key][alias] = row[alias];
      }
    }

    const insertStmt = db.prepare(`
      INSERT INTO chl_hub_master_data (
        hub_id, hub_name, district,
        corporation, railwayStations, approvedHomes, prisons,
        govtInstitutions, municipalities, townPanchayats, govtHospitals,
        educationalInstitutions, pwdPoondi, templeCamp
      )
      VALUES (
        @hub_id, @hub_name, @district,
        @corporation, @railwayStations, @approvedHomes, @prisons,
        @govtInstitutions, @municipalities, @townPanchayats, @govtHospitals,
        @educationalInstitutions, @pwdPoondi, @templeCamp
      )
      ON CONFLICT(hub_id, district) DO UPDATE SET
        hub_name = excluded.hub_name,
        corporation = excluded.corporation,
        railwayStations = excluded.railwayStations,
        approvedHomes = excluded.approvedHomes,
        prisons = excluded.prisons,
        govtInstitutions = excluded.govtInstitutions,
        municipalities = excluded.municipalities,
        townPanchayats = excluded.townPanchayats,
        govtHospitals = excluded.govtHospitals,
        educationalInstitutions = excluded.educationalInstitutions,
        pwdPoondi = excluded.pwdPoondi,
        templeCamp = excluded.templeCamp;
    `);

    const insertMany = db.transaction((data) => {
      for (const entry of Object.values(data)) {
        insertStmt.run(entry);
      }
    });

    insertMany(masterData);

    res.json({ status: 'success', message: 'chl_hub_master_data refreshed successfully' });
  } catch (error) {
    console.error("Error refreshing chl_hub_master_data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
