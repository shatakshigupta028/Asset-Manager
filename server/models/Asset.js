module.exports = (sequelize, DataTypes) => {
  const Asset = sequelize.define(
    "Asset",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      registrationNo: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        field: "registration_no",
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: DataTypes.STRING,
      serialNumber: {
        type: DataTypes.STRING,
        field: "serial_no",
      },
      processor: DataTypes.STRING,
      ram: DataTypes.STRING,
      storage: DataTypes.STRING,
      purchaseDate: {
        type: DataTypes.DATEONLY,
        field: "purchase_date",
      },
      warrantyExpiry: {
        type: DataTypes.DATEONLY,
        field: "warranty_expiry",
      },
      locationAsset:{
        type: DataTypes.ENUM("Office A", "Office B", "Warehouse"),
        defaultValue: "Warehouse",
        field:"location_asset",
      },
      warrantyProvider: {
        type: DataTypes.STRING,
        field: "warranty_provider",
      },
      supportContact: {
        type: DataTypes.STRING,
        field: "support_contact",
      },
      status: {
        type: DataTypes.ENUM("Active", "Retired", "Assigned", "Maintenance"),
        defaultValue: "Active",
      },
      room: DataTypes.INTEGER,
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      // userId:{
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      // },      
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: "updated_at",
      },
    },
    {
      tableName: "assets",
      timestamps: false,
      underscored: true,
    }
  );

  return Asset;
};
