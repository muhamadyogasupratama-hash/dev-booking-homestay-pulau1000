const { Op } = require('sequelize');
const { Booking, Homestay, Amnesty } = require('../models');

class ApiBookingController {
  static async index(req, res, next) {
    try {
      const where = req.user.role === 'admin' ? {} : { UserId: req.user.id };
      const data = await Booking.findAll({ where, include: [Homestay, Amnesty], order: [['createdAt', 'DESC']] });
      return res.json({ data });
    } catch (error) { return next(error); }
  }

  static async create(req, res, next) {
    try {
      const { HomeStayId, checkInDate, checkOutDate, amenityId } = req.body;
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      if (!HomeStayId || Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime()) || checkOut <= checkIn) {
        return res.status(400).json({ message: 'Homestay dan tanggal check-in/check-out yang valid wajib diisi.' });
      }
      const data = await Booking.sequelize.transaction(async (transaction) => {
        const homestay = await Homestay.findByPk(HomeStayId, { transaction, lock: transaction.LOCK.UPDATE });
        if (!homestay) {
          const error = new Error('Homestay tidak ditemukan.');
          error.statusCode = 404;
          throw error;
        }

        const selectedAmenity = amenityId ? await Amnesty.findByPk(amenityId, { transaction }) : null;
        if (amenityId && !selectedAmenity) {
          const error = new Error('Amenity tidak ditemukan.');
          error.statusCode = 400;
          throw error;
        }

        const overlappingBookings = await Booking.count({
          where: {
            HomeStayId: homestay.id,
            checkInDate: { [Op.lt]: checkOut },
            checkOutDate: { [Op.gt]: checkIn },
          },
          transaction,
        });
        if (overlappingBookings >= homestay.roomAvailable) {
          const error = new Error('Kamar homestay sudah penuh pada tanggal tersebut.');
          error.statusCode = 409;
          throw error;
        }

        return Booking.create({
          checkInDate: checkIn,
          checkOutDate: checkOut,
          UserId: req.user.id,
          HomeStayId: homestay.id,
          AmnestyId: selectedAmenity?.id || null,
        }, { transaction });
      });
      return res.status(201).json({ data });
    } catch (error) { return next(error); }
  }
}

module.exports = ApiBookingController;
