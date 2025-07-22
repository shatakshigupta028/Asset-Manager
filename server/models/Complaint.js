module.exports = (sequelize, DataTypes) => {
  const Complaint = sequelize.define("Complaint", {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Pending", "In Progress", "Resolved"),
      defaultValue: "Pending",
    },
    priority: {
      type: DataTypes.ENUM("Low", "Medium", "High"),
      defaultValue: "Medium",
    },
    registration_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resolution_note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  Complaint.associate = (models) => {
    Complaint.belongsTo(models.User, {
      foreignKey: "user_id",
      onDelete: "CASCADE",
    });
    Complaint.belongsTo(models.Asset, {
      foreignKey: "assetId",
      onDelete: "SET NULL",
    });
    Complaint.belongsTo(models.User, {
      as: "resolver",
      foreignKey: "resolved_by",
      onDelete: "SET NULL",
    }); 

  };


  return Complaint;
};
