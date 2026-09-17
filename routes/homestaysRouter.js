const router = require('express').Router()
const Controller = require('../controllers/controller')

router.post('/', Controller.landingPageLogin)
router.get('/', Controller.showHomestays)



module.exports = router