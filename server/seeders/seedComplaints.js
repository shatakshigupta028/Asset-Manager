'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [users] = await queryInterface.sequelize.query(`
      SELECT * FROM "Users" WHERE role IN ('2', '3')
    `);

    const [assignments] = await queryInterface.sequelize.query(`
       SELECT A.id AS "assignmentId", A."userId", A."assetId", R."registration_no", R."type"
       FROM "Assignments" A
       JOIN "assets" R ON A."assetId" = R.id
        JOIN "Users" U ON A."userId" = U.id 
    `);

    const statuses = ['Pending', 'Resolved', 'In Progress'];
    const priorities = ['Low', 'Medium', 'High'];
    const titles = ['Screen not working', 'Keyboard issue', 'Slow performance', 'Battery problem'];
    const descriptions = [
      'The device is not booting properly.',
      'Certain keys are unresponsive.',
      'System is very slow during operation.',
      'The battery drains quickly even on full charge.'
    ];

    const complaints = [];
    const roleMap = {
        '3': 'User',
        '2': 'Power User',
      };
      

    for (let i = 0; i < 10; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const assignment = assignments[Math.floor(Math.random() * assignments.length)];

      complaints.push({
        id: `C${String(i + 1).padStart(3, '0')}`,
        userId: user.id,
        assetId: assignment.assetId,
        registration_no: assignment.registration_no,
        asset_type: assignment.type, 
        user_role: roleMap[user.role] || 'Unknown',
        title: titles[Math.floor(Math.random() * titles.length)],
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('Complaints', complaints, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Complaints', null, {});
  }
};
