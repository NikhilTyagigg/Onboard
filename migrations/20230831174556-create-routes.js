'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Routes', {
      routeId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      routeNo: {
        type: Sequelize.STRING(20),
        index:true,
        allowNull:false
      },
      startPoint:{
        type: Sequelize.STRING,
        allowNull: false
      },
      endPoint:{
        type: Sequelize.STRING,
        allowNull : false
      },
      intermediateStops:{
        type: Sequelize.TEXT
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
    await queryInterface.addConstraint('Routes',{
      type: 'UNIQUE',
      name: 'routeno_unique', 
      fields:['routeNo'],
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    })
  },

 
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Routes');
  }
};