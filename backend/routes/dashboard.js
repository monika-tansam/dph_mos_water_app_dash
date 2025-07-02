// In your backend/routes/dashboardRoutes.js or similar
import express from 'express';
import db from '../utils/db.js';
import {getDashboardData,addDistrictOfficer,getDistrictData,getDistrictOfficers,addDataCollection,addChlorinationHub,addChlorinationDistrict,
  getAllHubsWithDistricts,
  addChlorinationUser,getOfficerCount,addChlorineUserDataEntry,
  getChlorinationUsers,addChlorinationDataCollector,getChlorineDataByHubId,getChlorinationDataCollectors,getChlorinationDataCollection,addMosquitoDistrict, getMosquitoDistricts
} from '../controllers/dashboardController.js';

const router = express.Router();

router.post('/', getDashboardData);
router.get('/district', getDistrictData);
router.get('/district-officers', getDistrictOfficers);
router.post('/add-district-officer', addDistrictOfficer);
router.post('/datacollection', addDataCollection);
router.post('/mos-district', addMosquitoDistrict);
router.get('/mos-district', getMosquitoDistricts);
// In your routes setup (likely in routes/login.js or similar)
router.get('/officer-count', getOfficerCount);

// Chlorination master
router.post('/hub', addChlorinationHub);
router.post('/district', addChlorinationDistrict);
router.get('/hubs-districts', getAllHubsWithDistricts);

// Chlorination user creation
router.post('/chl-hubusers', addChlorinationUser);
router.get('/chl-hubusers', getChlorinationUsers);

// Chlorination inspection tester creation
router.post('/add-chl-datacollector', addChlorinationDataCollector)
router.get('/chl-datacollector', getChlorinationDataCollectors)
router.post('/chl_datacollection', addChlorineUserDataEntry);
router.get('/chl_datacollection', getChlorinationDataCollection); // ✅ ADD THIS
router.get("/chl_datacollection/hubid", getChlorineDataByHubId);


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