// In your backend/routes/dashboardRoutes.js or similar
import express from 'express';
import dashboardController from '../controllers/dashboardController.js';

const router = express.Router();

router.post('/', dashboardController.getDashboardData);
router.get('/district', dashboardController.getDistrictData);
router.get('/district-officers', dashboardController.getDistrictOfficers);
router.post('/datacollection', dashboardController.addDataCollection);

export default router;