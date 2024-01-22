const express = require('express');
const {createPaymentIntent, webhooksHandler, createRefund} = require("../controllers/payment.controller");
const {auth} = require("../middleware/auth.middleware");
const router = express.Router();

/// Internal Payment routes
router.post('/payment-intents', createPaymentIntent);
router.post('/refund', auth, createRefund);

// router.post('/webhook', express.raw({type: 'application/json'}), webhooksHandler);

module.exports = router;