'use strict';
const fs = require('fs').promises
const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    let users = JSON.parse(await fs.readFile("./data/users.json", 'utf8'))
    users = await Promise.all(users.map(async(el) => {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(el.password, salt); 
      return {
        email: el.email,
        password: hash,
        role: el.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }))

    await queryInterface.bulkInsert('Users', users, {});

  },

  async down (queryInterface, Sequelize) {
 
    await queryInterface.bulkDelete('Users', null, {});

  }
};
