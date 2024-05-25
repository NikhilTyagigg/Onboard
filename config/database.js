/**
 * @class       : database
 * @author      : Keshav Goyal (keshav.goyal@kritikalvision.ai)
 * @created     : Tuesday August 29, 2023
 * @description : OnBoard Database
 */

const config = require('config');

const dbConfig = config.get('db');

const commonConfig = {
  database: dbConfig.name,
  username: dbConfig.username,
  password: dbConfig.password,
  host: dbConfig.host,
  dialect: 'mysql',
  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  seederStorage: 'sequelize',
  logging: false,
  dialectOptions: {
    useUTC: false, //for reading from database
    dateStrings: true,
    typeCast: true
  },
  timezone: '+00:00' // for writing to database
};

module.exports = {
  development: commonConfig,
  test: commonConfig,
  production: commonConfig,
}
