'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('QueryLogs', {
      queryLogId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      vehicleNo: {
        type: Sequelize.STRING(20),
        index:true,
        allowNull:false
      },
      routeNo:{
        type: Sequelize.STRING(20),
        allowNull: false
      },
      rssi:{
        type: Sequelize.STRING,
        allowNull : false
      },
      ackTime:{
        type: Sequelize.STRING
      },
      userId:{
        type: Sequelize.STRING,
        allowNull : false
      },
      source:{
        type : Sequelize.INTEGER(2)
      },
      module :{
        type : Sequelize.STRING
      },
      requestedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

 
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('QueryLogs');
  }
};