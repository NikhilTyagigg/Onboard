"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      userId: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      name: DataTypes.STRING(255),
      password: DataTypes.STRING,
      ConfirmPassword: DataTypes.STRING,
      phone: DataTypes.STRING(20),
      email: DataTypes.STRING,
      role: DataTypes.INTEGER,
      accessToken: DataTypes.STRING,
      refreshToken: DataTypes.STRING,
      city: DataTypes.STRING, // Added Identity field
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
