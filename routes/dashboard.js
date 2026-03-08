const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { isLoggedIn } = require('../middleware/auth');

router.get('/', isLoggedIn, dashboardController.getDashboard);
router.get('/total-records', dashboardController.getTotalRecords);
router.get('/active-cases', dashboardController.getActiveCases);
router.get('/monthly-cases', dashboardController.getCurrentMonthCases);
router.get('/criminal-records', dashboardController.getCriminalRecords);

module.exports = router; 