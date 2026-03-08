const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
<<<<<<< HEAD
const { isLoggedIn } = require('../middleware/auth');

router.get('/', isLoggedIn, dashboardController.getDashboard);
=======

router.get('/', dashboardController.getDashboard);
>>>>>>> 3efee63c2e506ee2d896186b0f067a4b926504dd
router.get('/total-records', dashboardController.getTotalRecords);
router.get('/active-cases', dashboardController.getActiveCases);
router.get('/monthly-cases', dashboardController.getCurrentMonthCases);
router.get('/criminal-records', dashboardController.getCriminalRecords);

module.exports = router; 