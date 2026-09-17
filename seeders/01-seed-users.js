'use strict';
const fs = require('fs').promises

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    let users = JSON.parse(await fs.readFile("./data/users.json", 'utf8'))
    users = users.map(el => {
      return {
        email: el.email,
        password: el.password,
        role: el.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })

    await queryInterface.bulkInsert('Users', users, {});

  },

  async down (queryInterface, Sequelize) {
 
    await queryInterface.bulkDelete('Users', null, {});

  }
};
