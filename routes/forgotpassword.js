
const express = require('express');

const forgotpasswordController = require('../controllers/forgotpassword');
const Auth =require('../middleware/auth')

const router = express.Router();



router.use('/forgotpassword', forgotpasswordController.forgotpassword);
router.use('/forgotpasswordhtml', forgotpasswordController.forgotpasswordhtml);
router.get('/updatepassword/:resetpasswordid',forgotpasswordController.updatepassword);

router.get('/resetpassword/:id',forgotpasswordController.resetpassword);


module.exports = router;