'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Bookings', 'AmnestyId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Amnesties',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'set null',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Bookings', 'AmnestyId');
  },
};
