'use strict';
const fs = require('fs').promises

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    let homestay = JSON.parse(await fs.readFile("./data/homestays.json", 'utf8'))
    homestay = homestay.map(el => {
      return {
        name: el.name,
        imageUrl: el.imageURL,
        pricePerNight: el.pricePerNight,
        roomAvailable: el.roomAvailable,
        contactPIC: el.contactPIC,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })

    await queryInterface.bulkInsert('Homestays',  homestay, {});

  },

  async down (queryInterface, Sequelize) {
 
    await queryInterface.bulkDelete('Homestays', null, {});

  }
};
