const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');
const { isLoggedIn, isAuthorized } = require('../middleware/auth');

router.get('/', isLoggedIn, isAuthorized(['admin', 'officer']), recordController.createRecord);
router.post('/submit', isLoggedIn, isAuthorized(['admin', 'officer']), recordController.submitRecord);

// Handle the POST request to save the record
router.post('/', recordController.saveRecord);

// New route for creating profile from case form
router.post('/case/:caseId', recordController.createProfileForCase);

module.exports = router;
