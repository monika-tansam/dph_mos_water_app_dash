// In your backend/routes/dashboardRoutes.js or similar
import express from 'express';
import db from '../utils/db.js';
import dashboardController from '../controllers/dashboardController.js';
import {
  addChlorinationHub,
  addChlorinationDistrict,
  getAllHubsWithDistricts
} from '../controllers/chlorinationController.js';


const router = express.Router();

router.post('/', dashboardController.getDashboardData);
router.get('/district', dashboardController.getDistrictData);
router.get('/district-officers', dashboardController.getDistrictOfficers);
router.post('/datacollection', dashboardController.addDataCollection);

// Chlorination master Table
router.post('/hub', addChlorinationHub);
router.post('/district', addChlorinationDistrict);
router.get('/hubs-districts', getAllHubsWithDistricts);

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