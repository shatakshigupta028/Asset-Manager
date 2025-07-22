const { Role, sequelize } = require("../models");
require('dotenv').config();  // 👈 Force load env


const seedRoles = async () => {
  try {
    await sequelize.sync(); // ensure tables exist

    await Role.bulkCreate([
      { id: 1, name: "admin" },
      { id: 2, name: "powerUser" },
      { id: 3, name: "user" },
    ], { ignoreDuplicates: true });

    console.log("✅ Roles seeded successfully.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding roles:", err);
    process.exit(1);
  }
};

seedRoles();
