import express from 'express';
import loginController from '../controllers/loginController.js';

const router = express.Router();

router.post('/', loginController.handleLogin);
router.post('/add-district-officer', loginController.addDistrictOfficer);
router.put('/edit-district-officer', loginController.editDistrictOfficer);

export default router;
