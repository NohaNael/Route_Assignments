const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        checkPasswordLength(value) {
          if (value.length < 6) {
            throw new Error("Password must be at least 6 characters long.");
          }
        },
      },
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
  },
  {
    tableName: "Users",
    timestamps: true,
    createdAt: "createdAT",
    updatedAt: "updatedAt",
  }
);

User.addHook("beforeCreate", "checkNameLength", (user) => {
  if (user.name.length <= 2) {
    throw new Error("Name must be greater than 2 characters.");
  }
});

module.exports = User;
