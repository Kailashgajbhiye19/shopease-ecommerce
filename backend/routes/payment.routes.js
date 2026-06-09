const express = require("express");
const router = express.Router();
const { createPaymentIntent } = require("../controllers/payment.controller.js");
const { protect } = require("../middleware/auth.middleware.js");

router.post("/create-payment-intent", protect, createPaymentIntent);

module.exports = router;
