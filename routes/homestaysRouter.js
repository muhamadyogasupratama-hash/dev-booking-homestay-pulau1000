const router = require('express').Router()
const UserController = require('../controllers/userController')
router.get('/', UserController.showHomestays)

router.get('/:id', UserController.showDetailHomestay)
router.get('/:id/booking', UserController.bookingHomestay)
router.post('/:id/booking', UserController.postBookingHomestay)



module.exports = router
