const { Amnesty } = require('../models');

exports.index = async (req, res, next) => {
  try { return res.json({ data: await Amnesty.findAll({ order: [['name', 'ASC']] }) }); }
  catch (error) { return next(error); }
};
