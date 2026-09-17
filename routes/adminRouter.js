const router = require('express').Router()
const AdminController = require('../controllers/adminController')

router.get('/', AdminController.showHomestaysAdmin)


module.exports = router