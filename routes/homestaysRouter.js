const router = require('express').Router()
const Controller = require('../controllers/controller')


router.get('/', Controller.showHomestays)
// router.get()
router.get('/:id', Controller.showDetailHomestay)
router.get('/:id/booking', Controller.bookingHomestay)
router.post('/:id/booking', Controller.postBookingHomestay)



module.exports = router