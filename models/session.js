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
    /* Solution: also includes the 'userId' and references the 'User' model, which is useful when doing the token extraction and assigning 
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    }, */
    token: {
      /* Solution: uses 'DataTypes.STRING' instead of 'DataTypes.TEXT' */
      type: DataTypes.TEXT,
      /* Solution: also includes 'allowNull: false' validation */
    },
  },
  {
    sequelize,
    underscored: true,
    /* Solution: does not explicitly declare timestamps to be false and leaves it as the defualt */
    timestamps: false,
    modelName: "session",
  }
);

module.exports = Session;
