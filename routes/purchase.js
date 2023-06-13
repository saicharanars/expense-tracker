

const express = require('express');
const auth=require('../middleware/auth');

const purchaseController = require('../controllers/purchase');


const router = express.Router();

router.get("/premium",auth.authenticate, purchaseController.premium);
router.post("/update-transaction-status",auth.authenticate, purchaseController.transactionstatus);



module.exports = router;