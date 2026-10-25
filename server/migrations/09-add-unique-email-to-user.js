'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('Users', ['email'], {
      name: 'users_email_unique',
      unique: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('Users', 'users_email_unique');
  },
};
