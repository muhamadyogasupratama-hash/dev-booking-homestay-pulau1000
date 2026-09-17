const router = require('express').Router()
const Controller = require('../controllers/controller')

router.post('/', Controller.landingPageLogin)
router.get('/', Controller.showHomestays)
router.get('/:id', Controller.showDetailHomestay)
router.get('/:id/booking', Controller.bookingHomestay)
router.post('/:id/booking', Controller.postBookingHomestay)



module.exports = router