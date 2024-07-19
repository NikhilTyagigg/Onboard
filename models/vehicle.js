"use strict";
const { allow } = require("joi");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Vehicle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Vehicle.hasOne(models.VehicleType, {
        sourceKey: "vehicleType",
        foreignKey: "vehicleTypeId",
      });
    }
  }
  Vehicle.init(
    {
      vehicleId: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      vehicleNo: {
        type: DataTypes.STRING(20),
        index: true,
        allowNull: false,
      },
      vehicleModule: {
        type: DataTypes.STRING,
        allowNull: false, //here i have changed the string
      },
      vehicleType: {
        type: DataTypes.INTEGER(5),
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        default: true,
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Vehicle",
    }
  );
  return Vehicle;
};
