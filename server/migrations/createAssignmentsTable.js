'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Assignments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      userName: {
        type: Sequelize.STRING,
      },
      userEmail: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userRole: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      userRoom: {
        type: Sequelize.STRING,
      },
      userLocation: {
        type: Sequelize.STRING,
      },
      assetStatus: {
        type: Sequelize.STRING,
        defaultValue: 'Assigned',
      },
      assetId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'assets',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      registrationNo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      assetType: {
        type: Sequelize.STRING,
      },
      assetWarrantyProvider: {
        type: Sequelize.STRING,
      },
      assetSupportContact: {
        type: Sequelize.STRING,
      },
      assignedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      returnedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Assignments');
  },
};
