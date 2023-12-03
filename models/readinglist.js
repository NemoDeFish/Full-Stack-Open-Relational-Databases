const { Model, DataTypes } = require("sequelize");

const { sequelize } = require("../util/db");

class Readinglist extends Model {}

Readinglist.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    blogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "blogs", key: "id" },
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    underscored: true,
    /* Solution: let timestamps be the default 'true' instead of explicitly declaring it to be false even though question does not state is required */
    timestamps: false,
    modelName: "readinglists",
  }
);

module.exports = Readinglist;
