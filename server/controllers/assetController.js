const { Asset, Assignment, User } = require("../models");
const generateRegistrationNo = require("../utils/generateRegistrationNo");

exports.createAsset = async (req, res) => {
  try {
    const data = req.body;
    const registrationNo = generateRegistrationNo(data.type);
    const asset = await Asset.create({ ...data, registrationNo });
    res.status(201).json({ message: "Asset created", asset });
  } catch (err) {
    res.status(500).json({ message: "Failed to create asset", error: err.message });
  }
};

exports.getAssets = async (req, res) => {
  try {
    const assets = await Asset.findAll();
    res.json(assets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch assets" });
  }
};

exports.getMyAssets = async (req, res) => {
  try {
    const assignments = await Assignment.findAll({
      where: { userId: req.user.id },
      include: [Asset],
    });
    const assets = assignments.map(a => a.Asset);
    res.json(assets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch assigned assets" });
  }
};

exports.assignAsset = async (req, res) => {
  try {
    const { userId, assetId } = req.body;
    const assignment = await Assignment.create({
      userId,
      assetId,
      assignedAt: new Date(),
    });
    res.json({ message: "Asset assigned", assignment });
  } catch (err) {
    res.status(500).json({ message: "Failed to assign asset" });
  }
};

exports.updateAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await Asset.findByPk(id);
    if (!asset) return res.status(404).json({ message: "Asset not found" });

    const { name, type, serialNumber, status } = req.body;
    if (name) asset.name = name;
    if (type) asset.type = type;
    if (serialNumber) asset.serialNumber = serialNumber;
    if (status) asset.status = status;

    await asset.save();
    res.json({ message: "Asset updated", asset });
  } catch (err) {
    res.status(500).json({ message: "Failed to update asset" });
  }
};

exports.deleteAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await Asset.findByPk(id);
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    await asset.destroy();
    res.json({ message: "Asset deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete asset" });
  }
};