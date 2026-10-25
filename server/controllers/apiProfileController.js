const { Profile } = require('../models');

class ApiProfileController {
  static async show(req, res, next) {
    try {
      const [data] = await Profile.findOrCreate({ where: { UserId: req.user.id }, defaults: { name: req.user.email, UserId: req.user.id } });
      return res.json({ data });
    } catch (error) { return next(error); }
  }

  static async update(req, res, next) {
    try {
      const [data] = await Profile.findOrCreate({ where: { UserId: req.user.id }, defaults: { UserId: req.user.id } });
      await data.update({ name: req.body.name, noHp: req.body.noHp, profilePicture: req.body.profilePicture });
      return res.json({ data });
    } catch (error) { return next(error); }
  }
}

module.exports = ApiProfileController;
