const { User, sequelize } = require("../models");
const bcrypt = require("bcrypt"); // If you hash passwords
const { Op } = require("sequelize");

const seedSampleUsers = async () => {
  try {
    await sequelize.sync(); // ensure tables exist
    // await User.destroy({
    //     where: {
    //       email: { [Op.ne]: "admin@ams.com" }
    //     }
    //   });
    await User.destroy({ where: {} }); 
    // Hash password for all users (optional, but recommended)
    const sApassword = await bcrypt.hash("sampleadmin123", 10);
    const sU1password = await bcrypt.hash("user1123", 10);
    const sU2password = await bcrypt.hash("user2123", 10);
    const sP1password = await bcrypt.hash("poweruser1123", 10);
    const sU3password = await bcrypt.hash("user3123", 10);
    const sP2password = await bcrypt.hash("poweruser2123", 10);

    // Create 5 sample users (role: 3 = user, 2 = powerUser, 1 = admin)
    await User.bulkCreate([
      { full_name: "Sample Admin", email: "sampleadmin@ams.com", password: sApassword, role: 1, room_no: "101", location: "Office A" },
      { full_name: "User 1", email: "user1@ams.com", password: sU1password, role: 3, room_no: "102", location: "Office B" },
      { full_name: "User 2", email: "user2@ams.com", password: sU2password, role: 3, room_no: "103", location: "Office A" },
      { full_name: "PowerUser 1", email: "poweruser1@ams.com", password: sP1password, role: 2, room_no: "104", location: "Office B" },
      { full_name: "User 3", email: "user3@ams.com", password: sU3password, role: 3, room_no: "105", location: "Office A" },
      { full_name: "PowerUser 2", email: "poweruser2@ams.com", password: sP2password, role: 2, room_no: "106", location: "Office B" },
    ],);

    console.log("✅ Sample users seeded successfully.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding users:", err);
    process.exit(1);
  }
};

seedSampleUsers();