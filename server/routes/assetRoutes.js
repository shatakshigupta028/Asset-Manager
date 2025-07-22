const express = require("express");
const router = express.Router();
const assetCtrl = require("../controllers/assetController");
const { verifyToken, onlyRole } = require("../middlewares/authMiddleware");

// Admin only: Create asset
router.post("/", verifyToken, onlyRole("admin"), assetCtrl.createAsset);

// Get all assets
router.get("/", verifyToken, assetCtrl.getAssets);

// Get assets assigned to current user
router.get("/my-assets", verifyToken, assetCtrl.getMyAssets);

// Assign asset (admin or powerUser only)
router.post("/assign", verifyToken, onlyRole("admin", "powerUser"), assetCtrl.assignAsset);

// Update asset (admin only)
router.put("/:id", verifyToken, onlyRole("admin"), assetCtrl.updateAsset);

// Delete asset (admin only)
router.delete("/:id", verifyToken, onlyRole("admin"), assetCtrl.deleteAsset);

module.exports = router;