const { Model, DataTypes } = require("sequelize");

const { sequelize } = require("../util/db");

class Blog extends Model {}

Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      /* Solution: includes extra validation 
      validate: {
        isInt: true,
        min: 0
      } */
    },
    year: {
      type: DataTypes.INTEGER,
      /* Solution: uses default error message instead of custom error message*/
      validate: {
        isInt: {
          args: true,
          msg: "Year field should be an integer at least equal to 1991 but not greater than the current year",
        },
        min: {
          args: 1991,
          msg: "Year field should be an integer at least equal to 1991 but not greater than the current year",
        },
        /* Solution: implements a custom function 'greaterThanCurrent(value) instead of using built-in 'max' validator, not sure why? 
        greaterThanCurrent(value) {
          const current = new Date().getFullYear()
          if (parseInt(value) > current) {
            throw new Error(`year can not be greater than ${current}`);
          }
        } */
        max: {
          args: new Date().getFullYear(),
          msg: "Year field should be an integer at least equal to 1991 but not greater than the current year",
        },
      },
    },
  },
  {
    sequelize,
    underscored: true,
    /* Solution: let timestamps be the default 'true' instead of explicitly declaring it to be false even though question does not state is required */
    timestamps: false,
    modelName: "blog",
  }
);

module.exports = Blog;
