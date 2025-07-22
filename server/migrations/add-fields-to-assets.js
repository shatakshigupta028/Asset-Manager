'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.addColumn('assets', 'location_asset', {
      type: Sequelize.ENUM("Office A", "Office B", "Warehouse"),
      defaultValue: "Warehouse",
    });

    await queryInterface.addColumn('assets', 'status', {
      type: Sequelize.ENUM("Active", "Retired", "Assigned", "Maintenance"),
      defaultValue: "Active",
    });

    await queryInterface.addColumn('assets', 'room', {
      type: Sequelize.INTEGER,
      defaultValue: "000",
    });

    await queryInterface.addColumn('assets', 'notes', {
      type: Sequelize.TEXT,
      allowNull: true,
    });       
},


async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('assets', 'location');
    await queryInterface.removeColumn('assets', 'status');
    await queryInterface.removeColumn('assets', 'room');
    await queryInterface.removeColumn('assets', 'notes');
}
};
  