const Purchase = require("../controller/purchase");
const express = require("express");
const router = express.Router();
const authendication = require("../middleware/auth");



router.get("/purchase-premium", authendication.authentication,Purchase.purchasePremium);
router.post("/update-transaction",authendication.authentication,Purchase.updateTransaction);


module.exports = router;
