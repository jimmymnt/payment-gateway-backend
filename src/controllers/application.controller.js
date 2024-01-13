const {OK} = require("../utils/status_code.util");
const crypto = require('crypto');
const {OAuthClientsModel} = require("../models/oauth.model");

const getApplications = async (req, res) => {
  try {
    // destructure page and limit and set default values
    const {page = 1, limit = 10} = req.query;

    // execute query with page and limit values
    const applications = await OAuthClientsModel.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    // get total documents in the collection
    const total = await OAuthClientsModel.countDocuments();

    res.status(OK)
      .json({
        applications,
        total: total,
        limit: parseInt(limit),
        page: parseInt(page),
      })
  } catch (error) {
    res.status(error.code || 500).json(error instanceof Error ? {error: error.message} : error);
  }
}

const createApplication = async (req, res) => {
  try {
    const {
      name,
      description,
      callback_url,
    } = req.body;
    let secretKey = crypto.randomBytes(28).toString('hex');
    let clientId = crypto.randomBytes(12).toString('hex');
    let userId = req.user.user_id;
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

const updateApplication = async (req, res) => {
  console.log(req);
  try {
    const {
      name,
      description,
      callback_url
    } = req.body;
    const {id} = req.params;
    console.log(id);

    console.log(req.body);
  } catch (error) {

  }
}

module.exports = {
  getApplications,
  createApplication,
  updateApplication,
}