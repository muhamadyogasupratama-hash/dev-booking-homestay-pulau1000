const router = require('express').Router()
const usersRouter = require('./usersRouter')
const homestaysRouter = require('./homestaysRouter')
const Controller = require('../controllers/controller')

router.get('/', Controller.landingPage)

router.use('/homestays', homestaysRouter)
router.use('/users', usersRouter)



module.exports = router