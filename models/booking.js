'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.User, {foreignKey: 'UserId'})
      Booking.belongsTo(models.Homestay, {foreignKey: 'HomeStayId'})
      
    }
  }
  Booking.init({
    checkInDate: DataTypes.DATE,
    checkOutDate: DataTypes.DATE,
    UserId: DataTypes.INTEGER,
    HomeStayId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};