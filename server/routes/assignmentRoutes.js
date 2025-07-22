const express = require("express");
const router = express.Router();
const { Assignment} = require("../models/index.js");
const { User} = require("../models/index.js");
const { Asset} = require("../models/index.js");

router.post("/", async (req, res) => {
  try {
    const { userId, assetId } = req.body;

    // Validation
    if (!userId || !assetId) {
      return res.status(400).json({ message: "userId and assetId are required" });
    }

     // Prevent duplicate assignment
     const existing = await Assignment.findOne({
      where: { assetId },
    });

    if (existing) {
      return res.status(409).json({ message: "Asset already assigned to a user." });
    }

    // Create assignment
    const assignment = await Assignment.create({ userId, assetId });

    return res.status(201).json({ message: "Asset assigned successfully", assignment });
  } catch (error) {
    console.error("Assign error:", error);
    return res.status(500).json({ message: "Failed to assign asset" });
  }
});

router.get("/", async (req, res) => {
  try {
    const assignments = await Assignment.findAll(
      {
      include: [
        // 
        {
          model: User,
          attributes: ['id', 'full_name', 'email', 'role', 'room_no', 'location'], 
        },
        {
          model: Asset,
          attributes: [
            'id',
            'registration_no',
            'type',
            'locationAsset',
            'warranty_provider',
            'support_contact',
          ],
        },
      ],
    });

    return res.status(200).json(assignments);
  } catch (error) {
    console.error("Fetch assignments error:", error.message, error.stack);
    return res.status(500).json({ message: "Failed to fetch assignments" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findByPk(id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    await assignment.destroy();
    return res.status(200).json({ message: "Asset returned successfully" });
  } catch (error) {
    console.error("Return asset error:", error);
    return res.status(500).json({ message: "Failed to return asset" });
  }
});

module.exports = router;
