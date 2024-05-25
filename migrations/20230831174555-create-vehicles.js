'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Vehicles', {
      vehicleId: {
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
      vehicleType:{
        type: Sequelize.INTEGER(5)
      },
      vehicleModule:{
        type: Sequelize.STRING
      },
      isActive:{
        type: Sequelize.BOOLEAN,
        default : true,
        allowNull : false
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

    await queryInterface.addConstraint('Vehicles',{
      type: 'FOREIGN KEY',
      name: 'FK_vehicleType_vehicle', 
      fields:['vehicleType'],
      references: {
        table: 'VehicleType',//change to Vehicletype to types
        field: 'vehicleTypeId',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    })
    await queryInterface.addConstraint('Vehicles',{
      type: 'UNIQUE',
      name: 'vehicleno_unique', 
      fields:['vehicleNo'],
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    })
  },


 
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Vehicles');
  }
};