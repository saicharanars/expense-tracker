

const express = require('express');

const userController = require('../controllers/user');


const router = express.Router();

router.post("/signup",userController.postSignup);
router.get("/signuphtml",userController.getSignup);
router.post("/login",userController.postLogin);
router.get("/loginhtml",userController.getLogin);


module.exports = router;