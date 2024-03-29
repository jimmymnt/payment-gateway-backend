const {iLogger} = require("../utils/logger.util");
const {MissingParameterPayloadError} = require("../exceptions/MissingParameterPayloadError");
const {OK} = require("../utils/status_code.util");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create payment intent and return `client_secret` back to the client
// For more details about `client_secret`:
// - The client secret of this PaymentIntent. Used for client-side retrieval using a publishable key.
// - The client secret can be used to complete a payment from your frontend. It should not be stored, logged, or exposed to anyone other than the customer. Make sure that you have TLS enabled on any page that includes the client secret.
// - Refer to our docs [https://stripe.com/docs/payments/accept-a-payment?ui=elements] to accept a payment and learn about how client_secret should be handled.
const createPaymentIntentHandler = async (req) => {
  const {
    amount,
    currency,
  } = req.body;

  if (!amount) {
    throw new Error(`Missing parameter "amount"`);
  }

  if (!currency) {
    throw new Error(`Missing parameter "currency"`);
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    automatic_payment_methods: {
      enabled: true,
    }
  }).then(result => {
    return result;
  }).catch(error => {
    iLogger.error(`CREATE PAYMENT INTENT ERR: ${error.message}`);
    throw new Error(`CREATE PAYMENT INTENT ERR: ${error.message}`);
  });

  // @TODO
  // Handle more business if needed.

  return paymentIntent;
}

const refundHandler = async (req) => {
  const {
    payment_intent,
    amount,
    reason,
  } = req.body;

  if (!payment_intent) {
    throw new MissingParameterPayloadError(`Missing parameter "payment_intent"`);
  }

  if (!amount) {
    throw new MissingParameterPayloadError(`Missing parameter "amount"`);
  }

  if (!reason) {
    throw new MissingParameterPayloadError(`Missing parameter "reason"`);
  }

  const reasons = ['requested_by_customer', 'duplicate', 'fraudulent'];
  if (!reasons.includes(reason)) {
    throw new Error(`Invalid reason: must be one of [${reasons}]`);
  }

  try {
    const refund = await stripe.refunds.create({
      payment_intent,
      amount,
      reason,
    });

    /**
     * TODO
     * Handle more business if needed.
     */
    return refund;

  } catch (error) {
    iLogger.error(`CREATE PAYMENT REFUND ERR: ${error.message}`);
    throw new Error(`CREATE PAYMENT REFUND ERR: ${error.message}`);
  }

}

module.exports = {
  createPaymentIntentHandler,
  refundHandler,
}