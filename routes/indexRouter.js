const router = require('express').Router()
const usersRouter = require('./usersRouter')
const homestaysRouter = require('./homestaysRouter')
const Controller = require('../controllers/controller')


router.get('/', Controller.landingPage)
router.post('/', Controller.landingPageLogin)

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
router.use('/homestays', homestaysRouter)
router.use('/users', usersRouter)



module.exports = router