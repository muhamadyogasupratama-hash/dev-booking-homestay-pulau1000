const router = require('express').Router()
const UserController = require('../controllers/userController')

router.get('/register', UserController.registerUser)
router.post('/register', UserController.registerUserPost)
router.get('/:id/myBooking', UserController.myBooking)
router.get('/:id/profile', UserController.showProfile)

module.exports = router