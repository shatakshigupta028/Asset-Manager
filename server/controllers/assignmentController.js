const { Assignment, User, Asset } = require('../models');

exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.findAll({
      include: [
        { model: User, as: 'Users', attributes: ['id', 'full_name', 'role', 'room_no', 'location'] },
        { model: Asset, as: 'assets', attributes: ['id', 'registration_no', 'type', 'location', 'warranty_provider', 'support_contact'] }
      ]
    });

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch assignments', error });
  }
};
