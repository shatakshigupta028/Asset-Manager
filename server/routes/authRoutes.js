const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { optionalAuth } = require("../middlewares/authMiddleware");

router.post("/register", optionalAuth, authController.register);
router.post("/login", authController.login);

module.exports = router;
