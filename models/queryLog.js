'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QueryLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  QueryLog.init({
    queryLogId: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    vehicleNo: {
      type: DataTypes.STRING(20),
      index: true,
      allowNull: false
    },
    routeNo: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    rssi: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ackTime: {
      type: DataTypes.STRING
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    source: {
      type: DataTypes.INTEGER(2)
    },
    module: {
      type: DataTypes.STRING
    },
    requestedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE

  }, {
    sequelize,
    modelName: 'QueryLog',
  });
  return QueryLog;
};