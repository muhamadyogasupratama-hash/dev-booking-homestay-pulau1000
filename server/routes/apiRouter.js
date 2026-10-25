const router = require('express').Router();
const authentication = require('../middlewares/authentication');
const requireAdmin = require('../middlewares/authorization');
const users = require('../controllers/apiUserController');
const homestays = require('../controllers/apiHomestayController');
const bookings = require('../controllers/apiBookingController');
const profile = require('../controllers/apiProfileController');
const amenities = require('../controllers/apiAmenityController');

router.get('/health', (_req, res) => res.json({ data: { status: 'ok' } }));
router.post('/users/register', users.register);
router.post('/users/login', users.login);
router.use(authentication);
router.get('/users/me', users.current);
router.post('/users/logout', users.logout);
router.get('/profile', profile.show);
router.put('/profile', profile.update);
router.get('/homestays', homestays.index);
router.get('/homestays/:id', homestays.show);
router.post('/homestays', requireAdmin, homestays.create);
router.put('/homestays/:id', requireAdmin, homestays.update);
router.patch('/homestays/:id', requireAdmin, homestays.update);
router.delete('/homestays/:id', requireAdmin, homestays.destroy);
router.get('/amenities', amenities.index);
router.get('/bookings', bookings.index);
router.post('/bookings', bookings.create);

module.exports = router;
