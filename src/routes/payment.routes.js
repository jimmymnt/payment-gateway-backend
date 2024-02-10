const express = require('express');
const {createPaymentIntent, createRefund} = require("../controllers/payment.controller");
const {auth} = require("../middleware/auth.middleware");
const {asyncHandler} = require("../utils/async_handler.utils");
const router = express.Router();

/// Internal Payment routes
router.post('/payment-intents', asyncHandler(createPaymentIntent));
router.post('/refund', auth, asyncHandler(createRefund));

// router.post('/webhook', express.raw({type: 'application/json'}), webhooksHandler);

module.exports = router;