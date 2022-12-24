'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: true,
        type: Sequelize.STRING(100)
      },
      family: {
        allowNull: true,
        type: Sequelize.STRING(100)
      },
      username: {
        allowNull: true,
        type: Sequelize.STRING(100)
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      imageUrl: {
        allowNull: true,
        type: Sequelize.STRING(100)
      },
      secrect_token: {
        allowNull: false,
        type: Sequelize.STRING(16)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },    
      registration_type: {
        allowNull: false,
        type: Sequelize.ENUM('email', 'google')
      },
      password: {
        type: Sequelize.STRING(80)
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};