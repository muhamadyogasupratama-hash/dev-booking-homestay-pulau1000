const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async function authentication(req, res, next) {
  let payload;
  try {
    const [scheme, token] = (req.get('authorization') || '').split(' ');
    if (scheme !== 'Bearer' || !token) return res.status(401).json({ message: 'Autentikasi diperlukan.' });
    payload = jwt.verify(token, process.env.JWT_SECRET || 'pulau-seribu-local-secret');
  } catch (error) {
    return res.status(401).json({ message: 'Token tidak valid atau sudah kedaluwarsa.' });
  }
  try {
    const user = await User.findByPk(payload.id);
    if (!user || payload.tokenVersion !== user.tokenVersion) return res.status(401).json({ message: 'Token tidak berlaku.' });
    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};
