// In your backend/routes/dashboardRoutes.js or similar
import express from 'express';
import db from '../utils/db.js';
import {
  getDashboardData,
  getDistrictData,
  getDistrictOfficers,
  addDataCollection,
  addChlorinationHub,
  addChlorinationDistrict,
  getAllHubsWithDistricts,
  addChlorinationUser,
  getChlorinationUsers,
  chlorinationcreatedatacollector
} from '../controllers/dashboardController.js';

const router = express.Router();

router.post('/', getDashboardData);
router.get('/district', getDistrictData);
router.get('/district-officers', getDistrictOfficers);
router.post('/datacollection', addDataCollection);

// Chlorination master
router.post('/hub', addChlorinationHub);
router.post('/district', addChlorinationDistrict);
router.get('/hubs-districts', getAllHubsWithDistricts);

// Chlorination user creation
router.post('/chl-hubusers', addChlorinationUser);
router.get('/chl-hubusers', getChlorinationUsers);
// routes/dashboardRoutes.js
router.get("/chl-hubusers", (req, res) => {
  const { hub_id } = req.query;

  try {
    let stmt;
    if (hub_id) {
      stmt = db.prepare(`SELECT * FROM chlorination_hub_users WHERE hub_id = ?`);
      const users = stmt.all(hub_id);
      res.json(users);
    } else {
      stmt = db.prepare(`SELECT * FROM chlorination_hub_users`);
      const allUsers = stmt.all();
      res.json(allUsers);
    }
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/hub-officer-info", (req, res) => {
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({ message: "Missing username" });
  }

  const user = db
    .prepare("SELECT hub_id FROM chlorination_hub_users WHERE username = ?")
    .get(username);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user); // ✅ Ensure JSON response
});


// routes/dashboardRoutes.js or similar
router.post("/chl-datacollector", chlorinationcreatedatacollector);

// Chlorination prediction route
router.get('/', (req, res) => {
  const { user_id, role, hub_id } = req.query;

  try {
    let data = [];

    if (role === 'admin') {
      data = db.prepare(`SELECT * FROM datacollection`).all();
    } else if (role === 'hub_officer') {
      // Only show data from districts under this hub
      data = db.prepare(`
        SELECT d.* FROM datacollection d
        JOIN district_officer_table o ON d.user_id = o.user_id
        WHERE o.hub_id = ?
      `).all(hub_id);
    } else {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    res.json({ data });

  } catch (err) {
    console.error('Dashboard fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;