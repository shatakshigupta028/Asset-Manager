const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Role = require("./Role")(sequelize, DataTypes);
const User = require("./User")(sequelize, DataTypes);
const Asset = require("./Asset")(sequelize, DataTypes);
const Assignment = require("./Assignment")(sequelize, DataTypes);
const Complaint = require("./Complaint")(sequelize, DataTypes);

Role.hasMany(User, { foreignKey: "role" });
User.belongsTo(Role, { foreignKey: "role" });

User.belongsToMany(Asset, {
  through: Assignment,
  foreignKey: "userId",
});
Asset.belongsToMany(User, {
  through: Assignment,
  foreignKey: "assetId",
});

Assignment.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Assignment, { foreignKey: 'userId' });
Assignment.belongsTo(Asset, { foreignKey: 'assetId' });
Asset.hasMany(Assignment, { foreignKey: 'assetId' });


User.hasMany(Complaint, { foreignKey: "userId" });
Asset.hasMany(Complaint, { foreignKey: "assetId" });
Complaint.belongsTo(User, { foreignKey: "userId" });
Complaint.belongsTo(Asset, { foreignKey: "assetId" });

module.exports = {
  sequelize,
  Role,
  User,
  Asset,
  Assignment,
  Complaint,
};
