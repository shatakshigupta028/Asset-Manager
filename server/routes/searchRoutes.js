const express = require("express");
const router = express.Router();
const { searchEverything } = require("../controllers/searchController");

router.get("/", searchEverything);

module.exports = router;
