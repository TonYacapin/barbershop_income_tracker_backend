const express = require('express'); const { getIncomeBySource, getIncomeByDate, getTotalIncome, getIncomeTrendsBySource, } = require('../controllers/incomeChartsControllers');

const router = express.Router();

// Route to get income data grouped by source 
 
router.get('/by-source', getIncomeBySource);

// Route to get income data grouped by date

 router.get('/by-date', getIncomeByDate);

// Route to get total income and metrics 

router.get('/total', getTotalIncome);

// Route to get income trends for a specific source

 router.get('/trends-by-source', getIncomeTrendsBySource);

module.exports = router;