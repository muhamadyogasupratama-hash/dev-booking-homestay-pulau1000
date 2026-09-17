const {Homestay, Amnesty, Booking, HomestayAmenity, Profile, User} = require('../models/index')
const {formatRupiah} = require("../helpers/formatRupiah")
const bcrypt = require('bcryptjs')
// const salt = bcrypt.genSaltSync(10);
// const hash = bcrypt.hashSync("B4c0/\/", salt);

class UserController {
    static async landingPage(req, res) {
        try {
            const {errors} = req.query
            res.render('landingPage', {errors})
        } catch (error) {
            res.send(error)
            console.log(error);
        }
    }

    static async landingPageLogin(req, res) {
        try {
            const {email, password} = req.body
            // console.log(email);
            // console.log(password);
            // if(email === "uzumaki@konoha.co.id" && password === "Uzumaki") {
            //     res.redirect('/homestays')
            //     } else {
            //         res.send("Login tidak sesuai")
            //     }
            const user = await User.findOne({
                where: {
                    email: email
                }
            })
            // console.log(user);

            if (user) {
                const isValidPassword = await bcrypt.compare(password, user.password)
                // console.log(isValidPassword);
                if (isValidPassword) {
                    req.session.userId = user.id
                    req.session.userRole = user.role

                    if (user.role === "admin") {
                        res.redirect('/admin')
                    }
                    else {
                        return res.redirect('/homestays')
                    }
                }
                else {
                    const error = "Invalid email/password"
                    return res.redirect(`/?errors=${error}`)
                }
            }
            else {
                const error = "Invalid email/password"
                // console.log('salah password');
                return res.redirect(`/?errors=${error}`)
            }

        } catch (error) {
            res.send(error)
        }
    }

    static async logoutUser(req, res) {
        try {
            req.session.destroy(function (err) {
                if(err) {
                    console.log(err);
                }
                res.redirect('/')
            });
        } catch (error) {
            res.send(error)
            console.log(error);
        }
    }


    static async registerUser(req, res) {
        try {
            res.render('registerUser')
        } catch (error) {
            res.send(error)
            console.log(error);
        }
    }

    static async registerUserPost(req, res) {
        try {
            const {name, email, password} = req.body

            // console.log(name);
            // console.log(email);
            // console.log(password);
            await User.create({name, email, password})

            res.redirect('/')
        } catch (error) {
            if (error.name === "SequelizeValidationError") {
                const errors = error.errors.map(err => err.message)
                return res.render('registerUser', {errors})
            }
            else {
                res.send(error)
                console.log(error);

            }
        }
    }

    static async showHomestays (req, res) {
        try {
            let homestays = await Homestay.findAll()

            // console.log(homestays);

            res.render('showHomestay', {homestays})

            // res.send("Welcome to Homestay")

        } catch (error) {
            res.send(error)
            console.log(error);
            
        }
    }

    static async showDetailHomestay (req, res) {
        try {
            const {id} = req.params
            const homestay = await Homestay.findByPk(id)
            // console.log(homestay.imageUrl);
            res.render('showDetailHomestay', {homestay})
            // res.send("Welcome to Homestay")

        } catch (error) {
            res.send(error)
            console.log(error);
            
        }
    }
    static async bookingHomestay (req, res) {
        try {
            const {id} = req.params
            const homestay = await Homestay.findByPk(id)
            let amnesty = await Amnesty.findAll()
            // console.log(homestay.imageUrl);
            res.render('bookingHomestay', {homestay, amnesty})
            // res.send("Welcome to Homestay")

        } catch (error) {
            res.send(error)
            console.log(error);
            
        }
    }

    static async postBookingHomestay (req, res) {
        try {
            const {id} = req.params
            const {checkInDate, checkOutDate, userId, amnesty, amenityId} = req.body
        await Booking.create({
            checkInDate,
            checkOutDate,
            UserId: req.session.userId,
            HomeStayId: id
          })
            // console.log(userId);
            // console.log(checkInDate);
            // console.log(checkOutDate);

            res.redirect('/homestays')
            // res.send("Welcome to Homestay")

        } catch (error) {
            res.send(error)
            console.log(error);
            
        }
    }

    
    static async showProfile(req, res) {
        try {
            
            const profile = await Profile.findByPk({})
        } catch (error) {
            
        }
    }

    

    
}


module.exports = UserController