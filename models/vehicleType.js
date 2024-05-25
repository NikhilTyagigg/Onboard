"use strict";
const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class VehicleType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  VehicleType.init(
    {
      vehicleTypeId: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      name: DataTypes.STRING(50),
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "VehicleType", // Correct casing for the model name
    }
  );

  return VehicleType; // Correct casing for the return value
};
