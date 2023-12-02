const { Model, DataTypes } = require("sequelize");

const { sequelize } = require("../util/db");

class Session extends Model {}

Session.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    token: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "session",
  }
);

module.exports = Session;
