module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Role", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.ENUM("admin", "powerUser", "user"), allowNull: false },
    });
  };
  