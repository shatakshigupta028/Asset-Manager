"use strict";
const { Op } = require('sequelize');


module.exports = {
 up: async (queryInterface) => {
    const [users] = await queryInterface.sequelize.query(
      `SELECT * FROM "Users" WHERE role IN ('2', '3')`
    );

    const [assets] = await queryInterface.sequelize.query(
      `SELECT * FROM "assets" WHERE status != 'Assigned'`
    );

    const assignments = [];
const assignmentCount = Math.min(users.length, assets.length, 10);
const usedAssetIds = new Set(); // move it outside the loop
// const roleMap = {
//   'user': 2,
//   'powerUser': 3,
  
// };



for (let i = 0; i < assignmentCount; i++) {
  const user = users[i];
  let asset;

  // Find a unique asset not already assigned
  do {
    asset = assets[Math.floor(Math.random() * assets.length)];
  } while (usedAssetIds.has(asset.id));

  usedAssetIds.add(asset.id);


      assignments.push({
        userId: user.id,
        userName: user.full_name,
        userEmail: user.email,
        userRole: user.role,
        userRoom: user.room_no || "N/A",
        userLocation: user.location || "N/A",

        assetId: asset.id,
        registrationNo: asset.registration_no,
        assetType: asset.type,
        assetWarrantyProvider: asset.warranty_provider || "Unknown",
        assetSupportContact: asset.support_contact || "Unknown",

        assetStatus: "Assigned",
        assignedAt: new Date(),
        returnedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert("Assignments", assignments);
    // Update status of assigned assets
    const assignedAssetIds = assignments.map((a) => a.assetId);
    
    await queryInterface.bulkUpdate(
      "assets",
      { status: "Assigned", updated_at: new Date() },
      { id: { [Op.in]: assignedAssetIds } }
    );
    
    
  },

  down: async (queryInterface)=> {
    await queryInterface.bulkDelete("Assignments", null, {});
  },
};