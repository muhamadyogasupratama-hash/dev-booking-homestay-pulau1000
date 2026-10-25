const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Profile } = require('../models');

const signToken = (user) => jwt.sign(
  { id: user.id, tokenVersion: user.tokenVersion },
  process.env.JWT_SECRET || 'pulau-seribu-local-secret',
  { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '1d' },
);

class ApiUserController {
  static async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      if (typeof name !== 'string' || !name.trim() || typeof email !== 'string' || !email.trim() || typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ message: 'Nama, email, dan password minimal 6 karakter wajib diisi.' });
      }
      const normalizedEmail = email.trim().toLowerCase();
      const existingUser = await User.findOne({ where: { email: normalizedEmail }, attributes: ['id'] });
      if (existingUser) return res.status(409).json({ message: 'Email sudah terdaftar.' });
      const user = await User.sequelize.transaction(async (transaction) => {
        const createdUser = await User.create({ email: normalizedEmail, password }, { transaction });
        await Profile.create({ name: name.trim(), UserId: createdUser.id }, { transaction });
        return createdUser;
      });
      return res.status(201).json({ message: 'Akun berhasil dibuat.', data: { id: user.id, email: user.email } });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') return res.status(409).json({ message: 'Email sudah terdaftar.' });
      return next(error);
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;
    if (typeof email !== 'string' || typeof password !== 'string') return res.status(400).json({ message: 'Email dan password wajib diisi.' });
    const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: 'Email atau password salah.' });
    return res.status(200).json({ access_token: signToken(user) });
  }

  static async current(req, res) {
    return res.status(200).json({ data: { id: req.user.id, email: req.user.email, role: req.user.role } });
  }

  static async logout(req, res) {
    await req.user.increment('tokenVersion');
    return res.status(200).json({ message: 'Berhasil logout.' });
  }
}

module.exports = ApiUserController;
