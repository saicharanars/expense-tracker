

const express = require('express');

const userController = require('../controllers/user');


password = require('./forgotpassword');


const router = express.Router();

router.post("/premium",userController.postSignup);
router.post("/signup",userController.postSignup);
router.get("/signuphtml",userController.getSignup);
router.post("/login",userController.postLogin);
router.get("/loginhtml",userController.getLogin);



module.exports = router;