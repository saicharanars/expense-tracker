
const express = require('express');

const forgotpasswordController = require('../controllers/forgotpassword');
const {authenticate} =require('../middleware/auth')

const router = express.Router();



router.use('/forgotpassword', forgotpasswordController.forgotpassword)

module.exports = router;