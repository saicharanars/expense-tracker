const path = require('path');

const express = require('express');

const homeController = require('../controllers/home');


const router = express.Router();
router.get("/",homeController.getExpense);
router.get("/get-data",homeController.getData);
router.post("/add-expense",homeController.postExpense);
router.delete('/delete-expense/:id',homeController.postDelete);


module.exports = router;