const router = require('express').Router()
const AdminController = require('../controllers/adminController')

router.get('/', AdminController.showHomestaysAdmin)
router.get('/homestays/add', AdminController.getAddHomestay)
router.post('/homestays/add', AdminController.postAddHomestay)
router.get('/homestays/:id/edit', AdminController.getEditHomestay)
router.post('/homestays/:id/edit', AdminController.postEditHomestay)
router.get('/homestays/:id/delete', AdminController.deleteHomestay)


module.exports = router
