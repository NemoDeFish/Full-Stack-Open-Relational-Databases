const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('blogs', 'year', {
      type: DataTypes.INTEGER,
      validate: {
      isInt: {
        args: true,
        msg: "Year field should be an integer at least equal to 1991 but not greater than the current year"
      },
      min: {
        args: 1991,
        msg: "Year field should be an integer at least equal to 1991 but not greater than the current year"
      },
      max: {
        args: (new Date()).getFullYear(),
        msg: "Year field should be an integer at least equal to 1991 but not greater than the current year"
      },
    }
    })
  }
}