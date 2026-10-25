'use strict';
const fs = require('fs').promises

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    let ameneties = JSON.parse(await fs.readFile("./data/amenities.json", 'utf8'))
    ameneties = ameneties.map(el => {
      return {
        name: el.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })

    await queryInterface.bulkInsert('Amnesties', ameneties, {});

  },

  async down (queryInterface, Sequelize) {
 
    await queryInterface.bulkDelete('Amnesties', null, {});

  }
};
