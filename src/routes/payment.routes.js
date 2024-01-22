const express = require('express');
const {createPaymentIntent, webhooksHandler} = require("../controllers/payment.controller");
const router = express.Router();

/// Internal Payment routes
router.post('/payment-intents', createPaymentIntent);

// router.post('/webhook', express.raw({type: 'application/json'}), webhooksHandler);

module.exports = router;