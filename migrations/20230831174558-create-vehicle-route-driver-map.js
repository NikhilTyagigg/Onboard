"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("VehicleRouteDriverMaps", {
      vehicleRouteDriverMapId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      vehicleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      routeId: {
        type: Sequelize.INTEGER,
      },
      driver: {
        type: Sequelize.STRING,
        index: true,
      },
      dateAndTime: {
        type: Sequelize.DATE,
        index: true,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        default: true,
        allowNull: false,
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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

    await queryInterface.addConstraint("VehicleRouteDriverMaps", {
      type: "FOREIGN KEY",
      name: "FK_vehicleRouteMap_vehicle",
      fields: ["vehicleId"],
      references: {
        table: "Vehicles",
        field: "vehicleId",
      },
      onDelete: "NO ACTION",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("VehicleRouteDriverMaps", {
      type: "FOREIGN KEY",
      name: "FK_vehicleRouteMap_route",
      fields: ["routeId"],
      references: {
        table: "Routes",
        field: "routeId",
      },
      onDelete: "NO ACTION",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("VehicleRouteDriverMaps");
  },
};
