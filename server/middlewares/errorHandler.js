module.exports = function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error.name === 'NotFound') return res.status(404).json({ message: 'Endpoint tidak ditemukan.' });
  if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ message: error.errors.map(({ message }) => message).join(', ') });
  }
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(409).json({ message: 'Data masih digunakan oleh relasi lain.' });
  }
  if (Number.isInteger(error.statusCode) && error.statusCode >= 400 && error.statusCode < 500) {
    return res.status(error.statusCode).json({ message: error.message });
  }
  console.error(error);
  return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
};
