const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("blogs", {
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
      },
    });
    await queryInterface.createTable("users", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: { isEmail: true },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      /* Solution: also includes the timestamps, however, the question did not state that it is required and I have not included it in the models too*/
    });
    /* Solution: includes the user_id inside the 'createTable' function instead of adding a column here. I think this is because since the table is being created, it should be included along with it if in the same migration. Unless the column is added afterwards, the 'addColumn' function shouldn't be appropriate here */
    await queryInterface.addColumn("blogs", "user_id", {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    });
    /* Solution: includes the timestamps inside the 'createTable' function instead of adding a column here. I think this is because since the table is being created, it should be included along with it if in the same migration. Unless the column is added afterwards, the 'addColumn' function shouldn't be appropriate here */
    await queryInterface.addColumn("users", "created_at", {
      type: DataTypes.DATE,
      /* Solution: also includes additional validation `allowNull: false` */
    });
    await queryInterface.addColumn("users", "updated_at", {
      type: DataTypes.DATE,
      /* Solution: also includes additional validation `allowNull: false` */
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable("blogs");
    await queryInterface.dropTable("users");
    // I think if I were to add the column separately here, I should also remove then in the down property here
  },
};
