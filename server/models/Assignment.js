module.exports = (sequelize, DataTypes) => {
  const Assignment = sequelize.define('Assignment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },

    userName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    userEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    userRole: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    userRoom: {
      type: DataTypes.STRING,
    },

    userLocation: {
      type: DataTypes.STRING,
    },

    assetStatus: {
      type: DataTypes.STRING,
      defaultValue: 'Assigned',
    },

    assetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'assets',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },

    registrationNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    assetType: {
      type: DataTypes.STRING,
    },

    assetWarrantyProvider: {
      type: DataTypes.STRING,
    },

    assetSupportContact: {
      type: DataTypes.STRING,
    },

    assignedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    returnedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  return Assignment;
};
