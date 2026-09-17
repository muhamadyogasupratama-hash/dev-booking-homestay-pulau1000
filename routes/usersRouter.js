const router = require('express').Router()
const UserController = require('../controllers/userController')

router.get('/register', UserController.registerUser)
router.post('/register', UserController.registerUserPost)
router.get('/profile', UserController.showProfile)

module.exports = router