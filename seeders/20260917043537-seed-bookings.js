'use strict';
const fs = require('fs').promises

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    let booking = JSON.parse(await fs.readFile("./data/bookings.json", 'utf8'))
    booking = booking.map(el => {
      return {
        checkInDate: el.checkInDate,
        checkOutDate: el.checkOutDate,
        UserId: el.UserId,
        HomeStayId: el.HomeStayId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })

    await queryInterface.bulkInsert('Bookings', booking, {});

  },

  async down (queryInterface, Sequelize) {
 
    await queryInterface.bulkDelete('Bookings', null, {});

  }
};
