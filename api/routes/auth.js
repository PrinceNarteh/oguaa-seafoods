const router = require('express').Router();
const authController = require('../controllers/auth');

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/forgotpassword').post(authController.forgotPassword);
router.route('/resetpassword/:resetToken').put(authController.resetPassword);

module.exports = router;