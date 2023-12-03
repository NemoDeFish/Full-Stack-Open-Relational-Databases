const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn("blogs", "year", {
      type: DataTypes.INTEGER,
      /* Solution: does not check for the validations here, but only inside the model. Same applies for the 'like' column in the first migration, not sure why? Maybe because migrations only make changes by adding columns to the database and the adding of the data is done via Sequelize in the models? */
      validate: {
        isInt: {
          args: true,
          msg: "Year field should be an integer at least equal to 1991 but not greater than the current year",
        },
        min: {
          args: 1991,
          msg: "Year field should be an integer at least equal to 1991 but not greater than the current year",
        },
        max: {
          args: new Date().getFullYear(),
          msg: "Year field should be an integer at least equal to 1991 but not greater than the current year",
        },
      },
    });
  },
  /* Solution: I forgot to add the 'down' property here
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('blogs', 'year')
  },
  */
};
