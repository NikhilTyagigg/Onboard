"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class VehicleRouteDriverMap extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      VehicleRouteDriverMap.hasOne(models.Vehicle, {
        sourceKey: "vehicleId",
        foreignKey: "vehicleId",
      });
      VehicleRouteDriverMap.hasOne(models.Route, {
        sourceKey: "routeId",
        foreignKey: "routeId",
      });
    }
  }
  VehicleRouteDriverMap.init(
    {
      vehicleRouteDriverMapId: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      vehicleId: {
        type: DataTypes.INTEGER,
      },
      routeId: {
        type: DataTypes.INTEGER,
      },
      driver: {
        type: DataTypes.STRING,
        index: true,
      },
      dateAndTime: {
        type: DataTypes.DATE,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        default: true,
        allowNull: false,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "VehicleRouteDriverMap",
    }
  );
  return VehicleRouteDriverMap;
};
