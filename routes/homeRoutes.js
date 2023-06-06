const path = require('path');

const express = require('express');

const auth=require('../middleware/auth')
const homeController = require('../controllers/home');


const router = express.Router();
router.get("/",homeController.getExpense);
router.get("/get-data",homeController.getData);
router.post("/add-expense",auth.authenticate,homeController.postExpense);
router.delete('/delete-expense/:id',auth.authenticate,homeController.postDelete);


module.exports = router;