const express = require('express');
const router = express.Router();
const { getCaptcha } = require('../controllers/captchaController');

router.get('/', getCaptcha);

module.exports = router;
