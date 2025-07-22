const { Complaint, Asset, User } = require("../models");

// User: Create complaint
exports.createComplaint = async (req, res) => {
  try {
    const { title, description, category, assetId } = req.body;

    const complaint = await Complaint.create({
      userId: req.user.id,
      title,
      description,
      category,
      assetId: assetId || null, 
    });

    res.status(201).json({ message: "Complaint submitted", complaint });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit complaint", error: err.message });
  }
};

// User: Get own complaints
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.findAll({
      where: { userId: req.user.id },
      include: [Asset]
    });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your complaints" });
  }
};

// Admin/PowerUser: Get all complaints
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.findAll({
      include: [
        { model: User, attributes: ["id", "email"] },
        { model: Asset, attributes: ["id", "type"] }
      ]
    });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
};

//Admin/PowerUser: Update status
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const complaint = await Complaint.findByPk(id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    complaint.status = status || complaint.status;
    await complaint.save();

    res.json({ message: "Complaint status updated", complaint });
  } catch (err) {
    res.status(500).json({ message: "Failed to update complaint", error: err.message });
  }
};

// Admin: Delete complaint
exports.deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findByPk(id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    await complaint.destroy();
    res.json({ message: "Complaint deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete complaint" });
  }
};
