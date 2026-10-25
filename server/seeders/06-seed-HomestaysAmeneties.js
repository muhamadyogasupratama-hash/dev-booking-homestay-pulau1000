'use strict';
const fs = require('fs').promises

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    let homestayAmeneties = JSON.parse(await fs.readFile("./data/homestay-amenities.json", 'utf8'))
    homestayAmeneties = homestayAmeneties.map(el => {
      return {
        HomeStayId: el.HomeStayId,
        AmenityId: el.AmenityId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })

    await queryInterface.bulkInsert('HomestayAmenities', homestayAmeneties, {});

  },

  async down (queryInterface, Sequelize) {
 
    await queryInterface.bulkDelete('HomestayAmenities', null, {});

  }
};
