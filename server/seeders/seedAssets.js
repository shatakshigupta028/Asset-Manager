'use strict';

const generateRegistrationNo = require('../utils/generateRegistrationNo');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const assetTypes = ['Laptop', 'Server', 'PC', 'Printer', 'Switch', 'Router', 'Display'];
    const locations = ['Office A', 'Office B', 'Warehouse'];
    const warrantyProviders = ['Dell', 'HP', 'Apple', 'Lenovo'];
    const supportContacts = ['1800-123-456', '1800-789-321', '1800-456-789'];
    const processors = ['Intel i5', 'Intel i7', 'M1 Pro', 'Xeon Silver'];
    const rams = ['8GB', '16GB', '32GB', '64GB'];
    const storages = ['256GB SSD', '512GB SSD', '1TB SSD', '2TB HDD'];
    const statuses = ['Active', 'Maintenance', 'Retired'];

    const assets = [];

    for (let i = 1; i <= 10; i++) {
      const type = assetTypes[Math.floor(Math.random() * assetTypes.length)];
      const reg_no = generateRegistrationNo(type);
      const purchaseDate = new Date();
      const warrantyDate = new Date(purchaseDate);
      warrantyDate.setFullYear(warrantyDate.getFullYear() + 3);

      const location = locations[Math.floor(Math.random() * locations.length)];
      const room = location === 'Warehouse'
        ? '100'
        : `${[101, 202, 301, 410][Math.floor(Math.random() * 4)]}`;

      const status = statuses[Math.floor(Math.random() * statuses.length)];

      assets.push({
        registration_no: reg_no,
        type,
        name: `${type} Model ${i}`,
        serial_no: `SN${100000 + i}`,
        processor: processors[i % processors.length],
        ram: rams[i % rams.length],
        storage: storages[i % storages.length],
        purchase_date: purchaseDate,
        warranty_expiry: warrantyDate,
        location_asset: location,
        warranty_provider: warrantyProviders[i % warrantyProviders.length],
        support_contact: supportContacts[i % supportContacts.length],
        room: room,
        status: status,
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    await queryInterface.bulkInsert('assets', assets, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('assets', null, {});
  }
};
