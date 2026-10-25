const { formatRupiah } = require("../helpers/formatRupiah");
("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Homestay extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Homestay.hasMany(models.Booking, {
        foreignKey: "HomeStayId",
      });

      Homestay.belongsToMany(models.Amnesty, {
        through: models.HomestayAmenity,
        foreignKey: 'HomestayId',
        otherKey: 'AmenityId',
      });
    }
 
    get formattedPrice() {
      return formatRupiah(this.pricePerNight);
    }
  }
  Homestay.init(
    {
      name: DataTypes.STRING,
      imageUrl: DataTypes.STRING,
      pricePerNight: DataTypes.INTEGER,
      roomAvailable: DataTypes.INTEGER,
      contactPIC: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Homestay",
    },
  );
  return Homestay;
};
