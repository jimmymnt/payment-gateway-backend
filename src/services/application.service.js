const {OK} = require("../utils/status_code.util");
const crypto = require('crypto');
const {OAuthClientsModel} = require("../models/oauth");
const oauthApplication = async (req, res) => {
  try {
    const {
      name,
      description,
      callback_url,
    } = req.body;
    let secretKey = crypto.randomBytes(28).toString('hex');
    let clientId = crypto.randomBytes(12).toString('hex');
    let userId = req.user.id;
    const application = new OAuthClientsModel({
      name,
      description,
      callback_url,
      client_id: clientId,
      user_id: userId,
      client_secret: secretKey,
      grants: [
        'authorization_code',
        'refresh_token',
      ]
    });

    const result = await application.save();
    res.status(OK).json({
      data: result,
    });
  } catch (error) {
    res.status(error.code || 500).json(error instanceof Error ? {error: error.message} : error);
  }
}

module.exports = {
  oauthApplication
}