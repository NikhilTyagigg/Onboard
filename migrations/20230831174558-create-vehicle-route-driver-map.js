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
        allowNull: false,
      },
      driver: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dateAndTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addIndex("VehicleRouteDriverMaps", ["driver"]);
    await queryInterface.addIndex("VehicleRouteDriverMaps", ["dateAndTime"]);
    await queryInterface.addConstraint("VehicleRouteDriverMaps", {
      fields: ["vehicleId", "routeId", "driver"],
      type: "unique",
      name: "unique_vehicle_route_driver",
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
