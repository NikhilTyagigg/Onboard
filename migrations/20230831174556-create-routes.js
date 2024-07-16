"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Routes", {
      routeId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      routeNo: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true, // Adding unique constraint here
      },
      startPoint: {
        type: Sequelize.STRING,
      },
      endPoint: {
        type: Sequelize.STRING,
      },
      startTime: {
        type: Sequelize.STRING,
      },
      endTime: {
        type: Sequelize.STRING,
      },
      depotname: {
        type: Sequelize.STRING,
      },
      sll: {
        type: Sequelize.STRING,
      },
      frequency: {
        type: Sequelize.STRING,
      },
      trip_length: {
        type: Sequelize.STRING,
      },
      SCH_NO: {
        type: Sequelize.STRING,
      },
      SERVICE: {
        type: Sequelize.STRING,
      },
      intermediateStops: {
        type: Sequelize.TEXT,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true, // Using defaultValue instead of default
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Routes");
  },
};
