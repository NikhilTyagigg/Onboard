"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Route extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Route.init(
    {
      routeId: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      routeNo: {
        type: DataTypes.STRING(20),
        index: true,
        allowNull: false,
      },
      startPoint: {
        type: DataTypes.STRING,
      },
      endPoint: {
        type: DataTypes.STRING,
      },

      startTime: {
        type: DataTypes.STRING, // Use TIME type for time values
      },
      endTime: {
        type: DataTypes.STRING,
      },
      depotname: {
        type: DataTypes.STRING, // Typo: Correct it to "depotName
      },
      frequency: {
        type: DataTypes.STRING, // Use STRING for frequency
      },
      trip_length: {
        type: DataTypes.STRING,
      },
      SCH_NO: {
        type: DataTypes.STRING,
      },
      SERVICE: {
        type: DataTypes.STRING,
      },
      intermediateStops: {
        type: DataTypes.JSONB, // Use JSONB type for storing JSON data
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
      modelName: "Route",
    }
  );
  return Route;
};
