const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');
<<<<<<< HEAD
const { isLoggedIn, isAuthorized } = require('../middleware/auth');

router.get('/', isLoggedIn, isAuthorized(['admin', 'officer']), recordController.createRecord);
router.post('/submit', isLoggedIn, isAuthorized(['admin', 'officer']), recordController.submitRecord);
=======

// Render the form for creating a new record
router.get('/', recordController.createRecord);
>>>>>>> 3efee63c2e506ee2d896186b0f067a4b926504dd

// Handle the POST request to save the record
router.post('/', recordController.saveRecord);

<<<<<<< HEAD
=======
// Handle the POST request to submit the record
router.post('/submit', recordController.submitRecord);

>>>>>>> 3efee63c2e506ee2d896186b0f067a4b926504dd
// New route for creating profile from case form
router.post('/case/:caseId', recordController.createProfileForCase);

module.exports = router;
