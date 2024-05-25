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
        allowNull: false,
      },
      routeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      driver: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dateAndTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "VehicleRouteDriverMap",
      indexes: [
        {
          unique: true,
          fields: ["vehicleId", "routeId", "driver"],
        },
      ],
      timestamps: true,
    }
  );

  return VehicleRouteDriverMap;
};
