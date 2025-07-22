const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/complaintController");
const { verifyToken, onlyRole } = require("../middlewares/authMiddleware");

// User: Submit a complaint
router.post("/", verifyToken, onlyRole("user", "powerUser"), ctrl.createComplaint);

// User: Get own complaints
router.get("/my", verifyToken, onlyRole("user"), ctrl.getMyComplaints);

// Admin/PowerUser: Get all complaints
router.get("/", verifyToken, onlyRole("admin", "powerUser"), ctrl.getAllComplaints);

// Admin/PowerUser: Update complaint status
router.put("/:id", verifyToken, onlyRole("admin", "powerUser"), ctrl.updateComplaintStatus);

// Admin: Delete complaint
router.delete("/:id", verifyToken, onlyRole("admin"), ctrl.deleteComplaint);

module.exports = router;
