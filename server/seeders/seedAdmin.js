// seedAdmin.js
const { User, Role } = require("../models");
const bcrypt = require("bcrypt");


    // const adminRole = await Role.findOne({ where: { name: "admin" } });
    // if (!adminRole) throw new Error("❌ Admin role not found!");
async function recreateAdmin() {  
  try {
    await User.destroy({ where: { email: "admin@ams.com" } });

  const hashedPassword = await bcrypt.hash("admin123", 10);
  await User.create({
    full_name: "Admin",
    email: "admin@ams.com",
    password: hashedPassword,
    role: 1,
    room_no: "501",
    location: "Office B"
  });
} catch (error) {
  console.error("❌ Error creating admin:", error);
}

  console.log("✅ Admin created");
    }


recreateAdmin();
