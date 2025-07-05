// In your backend/routes/dashboardRoutes.js or similar
import express from 'express';
import db from '../utils/db.js';
import {getDashboardData,addDistrictOfficer,getDistrictData,getDistrictOfficers,addDataCollection,addChlorinationHub,addChlorinationDistrict,
  getAllHubsWithDistricts,addCorporationMaster,addMunicipalityMaster,getMunicipalityMaster,addTownPanchayatMaster,addGovernmentHospital,
  addChlorinationUser,getOfficerCount,addChlorineUserDataEntry,getChlorinationDistrictsByHub,getTownPanchayatMaster,getGovernmentHospitals,
  getChlorinationUsers,addChlorinationDataCollector,getChlorineDataByHubId,getChlorinationDataCollectors,getChlorinationDataCollection,addMosquitoDistrict, getMosquitoDistricts,
  addRailwayStationMaster,getRailwayStationMaster,addApprovedHomesMaster,getApprovedHomesMaster,addPrisonMaster,getPrisonMaster,addTempleFestival,
  getGovernmentInstitutionMaster,addGovernmentInstitutionMaster,addEducationalInstitutionMaster,getEducationalInstitutionMaster,addPWDMaster,getPWDMaster,getTempleFestivals,
  getHubMasterData,refreshHubMasterData,
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
router.get('/chl-districts-by-hub', getChlorinationDistrictsByHub);
router.post("/corporation-master", addCorporationMaster);
router.post("/municipality-master", addMunicipalityMaster);
router.get("/municipality-master", getMunicipalityMaster);
router.post("/townpanchayat-master", addTownPanchayatMaster);
router.get("/townpanchayat-master", getTownPanchayatMaster);
router.post("/government-hospital-master", addGovernmentHospital);
router.get("/government-hospital-master", getGovernmentHospitals);
router.post("/railway-station-master", addRailwayStationMaster);
router.get("/railway-station-master", getRailwayStationMaster);
router.post("/approved-homes-master", addApprovedHomesMaster);
router.get("/approved-homes-master", getApprovedHomesMaster);
router.post("/prison-master", addPrisonMaster);
router.get("/prison-master", getPrisonMaster);
router.get("/government-institution-master", getGovernmentInstitutionMaster);
router.post("/government-institution-master", addGovernmentInstitutionMaster);
router.post("/pwd-master", addPWDMaster);
router.get("/pwd-master", getPWDMaster);
router.post('/temple-festival-master', addTempleFestival);
router.get('/temple-festival-master', getTempleFestivals);
// routes/dashboardRoutes.js
router.post('/educational-institution-master', addEducationalInstitutionMaster);
router.get('/educational-institution-master', getEducationalInstitutionMaster);
// Chlorination hub master data
// router.get('/chl-hub-master-data', getHubMasterData);
router.get("/chl-hub-master-data", getHubMasterData);

router.post('/refresh-chl-hub-master-data', refreshHubMasterData);



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


const fieldPriority = [
  "corporation", "railwayStations", "approvedHomes", "prisons",
  "govtInstitutions", "municipalities", "townPanchayats",
  "govtHospitals", "educationalInstitutions", "pwdPoondi", "templeCamp"
];

router.get('/predict-travel', (req, res) => {
  try {
    console.log("✅ /predict-travel route hit");

    const collectors = db.prepare("SELECT * FROM chlorination_data_collectors").all();
    const masterData = db.prepare("SELECT * FROM chl_hub_master_data").all();

    console.log(`📌 Collectors fetched: ${collectors.length}`);
    console.log(`📌 Master data rows fetched: ${masterData.length}`);

    if (masterData.length === 0) {
      console.warn("⚠️ No master data found.");
    }

    // Group collectors by hub
    const collectorsByHub = {};
    for (const collector of collectors) {
      if (!collectorsByHub[collector.hub_id]) {
        collectorsByHub[collector.hub_id] = [];
      }
      collectorsByHub[collector.hub_id].push(collector);
    }

    const predictionResult = {};

    for (const hub_id in collectorsByHub) {
      const users = collectorsByHub[hub_id];
      const hubRows = masterData.filter((row) => row.hub_id === hub_id);

      if (hubRows.length === 0) {
        console.warn(`⚠️ No matching master data for hub_id: ${hub_id}`);
        continue;
      }

      let userIndex = 0;

      for (const row of hubRows) {
        const district = row.district;

        for (const field of fieldPriority) {
          const count = row[field];
          if (!count || count <= 0) continue;

          for (let i = 0; i < count; i++) {
            const assignedUser = users[userIndex % users.length];

            const task = {
              username: assignedUser.username,
              hub_id: assignedUser.hub_id,
              hub_name: assignedUser.hub_name,
              district,
              field_type: field,
            };

            if (!predictionResult[hub_id]) predictionResult[hub_id] = [];
            predictionResult[hub_id].push(task);

            userIndex++;
          }
        }
      }
    }

    // Print the plan
    if (Object.keys(predictionResult).length === 0) {
      console.warn("❌ No travel assignments generated.");
    } else {
      for (const hub in predictionResult) {
        console.log(`\n===== 🧭 TRAVEL PLAN FOR HUB: ${hub} =====`);
        predictionResult[hub].forEach((entry, i) => {
          const formattedField = entry.field_type.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
          console.log(`#${i + 1} | ${entry.username} → ${formattedField} in ${entry.district}`);
        });
      }
    }

    res.json({ status: 'ok', message: 'Travel prediction complete. Check console.' });
  } catch (error) {
    console.error('❌ Travel Prediction Error:', error);
    res.status(500).json({ error: 'Travel prediction failed' });
  }
});

export default router;