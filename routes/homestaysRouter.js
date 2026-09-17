const router = require('express').Router()
const UserController = require('../controllers/userController')
const AdminController = require('../controllers/adminController')


router.get('/', UserController.showHomestays)

router.get('/admin', AdminController.showHomestaysAdmin)
router.get('/:id', UserController.showDetailHomestay)
router.get('/:id/booking', UserController.bookingHomestay)
router.post('/:id/booking', UserController.postBookingHomestay)
router.get("/edit/:id", AdminController.getEditHomestay)
router.post("/edit/:id", AdminController.postEditHomestay)



module.exports = router