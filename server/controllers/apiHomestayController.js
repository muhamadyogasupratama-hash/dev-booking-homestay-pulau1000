const { Homestay } = require('../models');

const validHomestay = (body, partial = false) => {
  const fields = ['name', 'imageUrl', 'pricePerNight', 'roomAvailable', 'contactPIC'];
  if (!partial && fields.some((field) => body[field] === undefined || body[field] === '')) return false;
  if (['name', 'imageUrl', 'contactPIC'].some((field) => body[field] !== undefined && (typeof body[field] !== 'string' || !body[field].trim()))) return false;
  if (partial && ['pricePerNight', 'roomAvailable'].some((field) => body[field] === '')) return false;
  if (body.pricePerNight !== undefined && (!Number.isInteger(Number(body.pricePerNight)) || Number(body.pricePerNight) < 0)) return false;
  if (body.roomAvailable !== undefined && (!Number.isInteger(Number(body.roomAvailable)) || Number(body.roomAvailable) < 0)) return false;
  return true;
};

class ApiHomestayController {
  static async index(req, res, next) {
    try { return res.json({ data: await Homestay.findAll({ order: [['id', 'ASC']] }) }); }
    catch (error) { return next(error); }
  }

  static async show(req, res, next) {
    try {
      const data = await Homestay.findByPk(req.params.id);
      if (!data) return res.status(404).json({ message: 'Homestay tidak ditemukan.' });
      return res.json({ data });
    } catch (error) { return next(error); }
  }

  static async create(req, res, next) {
    try {
      if (!validHomestay(req.body)) return res.status(400).json({ message: 'Lengkapi data homestay dengan format yang benar.' });
      const data = await Homestay.create({ ...req.body, pricePerNight: Number(req.body.pricePerNight), roomAvailable: Number(req.body.roomAvailable) });
      return res.status(201).json({ data });
    } catch (error) { return next(error); }
  }

  static async update(req, res, next) {
    try {
      if (!validHomestay(req.body, true)) return res.status(400).json({ message: 'Data harga atau jumlah kamar tidak valid.' });
      const data = await Homestay.findByPk(req.params.id);
      if (!data) return res.status(404).json({ message: 'Homestay tidak ditemukan.' });
      const values = { ...req.body };
      if (values.pricePerNight !== undefined) values.pricePerNight = Number(values.pricePerNight);
      if (values.roomAvailable !== undefined) values.roomAvailable = Number(values.roomAvailable);
      await data.update(values);
      return res.json({ data });
    } catch (error) { return next(error); }
  }

  static async destroy(req, res, next) {
    try {
      const data = await Homestay.findByPk(req.params.id);
      if (!data) return res.status(404).json({ message: 'Homestay tidak ditemukan.' });
      await data.destroy();
      return res.status(204).end();
    } catch (error) { return next(error); }
  }
}

module.exports = ApiHomestayController;
