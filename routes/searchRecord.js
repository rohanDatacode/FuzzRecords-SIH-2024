const express = require('express');
const router = express.Router();
const searchController = require("../controllers/searchController");

<<<<<<< HEAD
router.get("/" ,searchController.searchRecord);

router.post("/" ,searchController.resultRecord);
=======
router.get("/", searchController.searchRecord);

router.post("/", searchController.resultRecord);


>>>>>>> 3efee63c2e506ee2d896186b0f067a4b926504dd

module.exports = router;