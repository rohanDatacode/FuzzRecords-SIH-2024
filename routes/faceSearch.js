const express = require('express');
const router = express.Router();
const Profile = require('../models/profileSchema');
const { isLoggedIn } = require('../middleware/auth');

router.get('/', isLoggedIn, async (req, res) => {
    // Get all profiles that HAVE a face signature stored
    const profiles = await Profile.find({ faceDescriptor: { $exists: true, $ne: [] } });
    res.render('records/faceSearch', { profiles });
});

module.exports = router;