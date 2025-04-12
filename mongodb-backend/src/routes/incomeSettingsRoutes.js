const express = require('express');
const { setIncomeSettings, getIncomeSettings } = require('../controllers/incomeSettingsControllers');
const { authenticateToken } = require('../middleware/authMiddleware'); // Optional: Protect routes

const router = express.Router();

// Route to create or update income settings
router.post('/', authenticateToken, setIncomeSettings);

// Route to get income settings
router.get('/', authenticateToken, getIncomeSettings);

module.exports = router;