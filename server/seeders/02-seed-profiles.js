'use strict';
const fs = require('fs').promises

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    let profile = JSON.parse(await fs.readFile("./data/profiles.json", 'utf8'))
    profile = profile.map(el => {
      return {
        name: el.name,
        noHp: el.noHp,
        profilePicture: el.profilePicture,
        UserId: el.UserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })

    await queryInterface.bulkInsert('Profiles', profile, {});

  },

  async down (queryInterface, Sequelize) {
 
    await queryInterface.bulkDelete('Profiles', null, {});

  }
};
