// controllers/searchController.js
const { Asset, User, Complaint } = require("../models");
const { Op } = require("sequelize");


exports.searchEverything = async (req, res) => {
  const query = req.query.q?.toLowerCase() || "";

  try {
    const assetResults = await Asset.findAll({
      where: {
        name: { [Op.iLike]: `%${query}%` }
      },
      attributes: ["id", "name"]
    });

    const userResults = await User.findAll({
      where: {
        full_name: { [Op.iLike]: `%${query}%` }
      },
      attributes: ["id", "full_name"]
    });

    const complaintResults = await Complaint.findAll({
      where: {
        description: { [Op.iLike]: `%${query}%` }
      },
      attributes: ["id", "description"]
    });

    const suggestions = [
      ...assetResults.map((a) => ({ id: a.id, text: a.name, type: "asset" })),
      ...userResults.map((u) => ({ id: u.id, text: u.name, type: "user" })),
      ...complaintResults.map((c) => ({ id: c.id, text: c.description, type: "complaint" })),
    ];

    res.json(suggestions);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
