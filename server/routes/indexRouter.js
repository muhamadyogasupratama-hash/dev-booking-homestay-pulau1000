const router = require('express').Router()
const usersRouter = require('./usersRouter')
const homestaysRouter = require('./homestaysRouter')
const adminRouter = require('./adminRouter')
const UserController = require('../controllers/userController')

router.get('/', UserController.landingPage)
router.post('/', UserController.landingPageLogin)
router.use('/users', usersRouter)


router.use(function(req, res, next){
    // console.log(req.session);
    if (!req.session.userId) {
        const error = "Please login first!"
        res.redirect(`/?errors=${error}`)
    }
    else {
        next()
    }
})

router.get('/logout', UserController.logoutUser)
router.use('/homestays', homestaysRouter)

router.use(function(req, res, next){
    // console.log(req.session);
    if (req.session.userRole === "admin") {
        next()
    } else {
        const error = "Access denied! You are not an admin"
        res.redirect(`/?errors=${error}`)
    }
})

router.use('/admin', adminRouter)





module.exports = router