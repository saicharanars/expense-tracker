

const express = require('express');

const userController = require('../controllers/user');


const router = express.Router();

router.post("/signup",userController.postSignup);
router.get("/signuphtml",userController.getSignup);


module.exports = router;