const router = require('express').Router()
const Controller = require('../controllers/controller')

router.get('/register', Controller.registerUser)
router.post('/register', Controller.registerUserPost)
router.get('/profile', Controller.showProfile)

module.exports = router