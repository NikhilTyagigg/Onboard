'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('VehicleRouteDriverMaps','isVerified',{
      type : Sequelize.BOOLEAN,
      default : false
    })
  }
};