
  'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Complaints', 'asset_type', {
        type: Sequelize.STRING,
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Complaints', 'asset_type');
  }
};