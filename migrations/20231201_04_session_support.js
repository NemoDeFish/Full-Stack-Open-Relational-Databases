const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn("users", "disabled", {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.createTable("sessions", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      /* Solution: also includes the 'userId' and references the 'User' model, which is useful when doing the token extraction and assigning 
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      }, */
      token: {
        /* Solution: uses 'DataTypes.STRING' instead of 'DataTypes.TEXT' */
        type: DataTypes.TEXT,
        /* Solution: also includes 'allowNull: false' validation */
      },
      /* Solution: also includes the timestamps, however, the question did not state that it is required and I have not included it in the models too */
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("users", "disabled");
    await queryInterface.dropTable("sessions");
  },
};
