const {
  Homestay,
  Amnesty,
  Booking,
  HomestayAmenity,
  Profile,
  User,
} = require("../models/index");
const { formatRupiah } = require("../helpers/formatRupiah");

class AdminController {
  static async showHomestaysAdmin(req, res) {
    try {
      const homestays = await Homestay.findAll();

      res.render("adminShowHomestays", { homestays });
    } catch (error) {
      res.send(error);
      console.log(error);
    }
  }

  static async getEditHomestay(req, res) {
    try {
      const { id } = req.params;
      const homestay = await Homestay.findByPk(id);
      res.render("editFormHomestay", { homestay });
    } catch (error) {
      res.send(error);
    }
  }

  static async postEditHomestay(req, res) {
    try {
      const { id } = req.params

      const { name, imageUrl, pricePerNight, roomAvailable, contactPIC } =
        req.body;

      await Homestay.update(
        {
          name,
          imageUrl,
          pricePerNight,
          roomAvailable,
          contactPIC,
        },
        {
          where: {
            id: id,
          },
        },
      );

      res.redirect("/homestays");
    } catch (error) {
      res.send(error);
    }
  }

  static async getAddHomestay(req, res) {
    try {
      res.render("addFormHomestay");
    } catch (error) {
      res.send(error);
    }
  }

  static async postAddHomestay(req, res) {
    try {
      const { name, imageUrl, pricePerNight, roomAvailable, contactPIC } =
        req.body;

      await Homestay.create({
        name,
        imageUrl,
        pricePerNight,
        roomAvailable,
        contactPIC,
      });

      res.redirect("/admin");
    } catch (error) {
      res.send(error);
    }
  }

  static async getEditHomestay(req, res) {
    try {
      const { id } = req.params;
      const homestay = await Homestay.findByPk(id);
      res.render("editFormHomestay", { homestay });
    } catch (error) {
      res.send(error);
    }
  }

  static async postEditHomestay(req, res) {
    try {
      const { id } = req.params

      const { name, imageUrl, pricePerNight, roomAvailable, contactPIC } =
        req.body;

      await Homestay.update(
        {
          name,
          imageUrl,
          pricePerNight,
          roomAvailable,
          contactPIC,
        },
        {
          where: {
            id: id,
          },
        },
      );

      res.redirect("/admin");
    } catch (error) {
      res.send(error);
    }
  }

  static async deleteHomestay(req, res) {
    try {
      const { id } = req.params;

      await Homestay.destroy({
        where: { id },
      });

      res.redirect('/admin');
    } catch (error) {
      res.send(error);
    }
  }

}

module.exports = AdminController;
