const {OK, INTERNAL_SERVER, BAD_REQUEST} = require("../utils/status_code.util");
const {createPaymentIntentHandler, refundHandler} = require("../services/payment.service");
const {iLogger} = require("../utils/logger.util");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
  const result = await createPaymentIntentHandler(req);
  if (!!result) {
    return res.status(OK)
      .json({
        message: 'DONE',
        client_secret: result.client_secret
      });
  }
}

/**
 * In here we can control and handle everything related to Event which has been sent to our system by STRIPE.
 * For more details, we can see all events via command `stripe help trigger` (required `stripe CLI` installed)
 * @author Jimmy
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const webhooksHandler = async (req, res) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    iLogger.error(`Webhook Error: ${err.message}`);
    return res.status(BAD_REQUEST).send(`webhook_error: ${err.message}`);
  }

  // Handle the event
  iLogger.info(`Event: ${event}`);
  console.log(`Unhandled event type ${event.type}`);

  // Return a 200 response to acknowledge receipt of the event
  res.status(OK).json({
    message: "ok",
  });
}

const createRefund = async (req, res) => {
  const result = await refundHandler(req);
  if (!!result) {
    return res.status(OK)
      .json({
        message: "refunded",
        data: result,
      });
  }
}

module.exports = {
  createPaymentIntent,
  webhooksHandler,
  createRefund,
}