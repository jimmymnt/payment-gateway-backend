const {OK, NOT_FOUND, INTERNAL_SERVER} = require("../utils/status_code.util");
const crypto = require('crypto');
const {OAuthClientsModel} = require("../models/oauth.model");

const getApplications = async (req, res) => {
  try {
    // destructure page and limit and set default values
    const {page = 1, limit = 10} = req.query;

    // execute query with page and limit values
    const applications = await OAuthClientsModel.find({
      user_id: req.user.user_id,
    })
      .select('-client_secret -__v')
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    // get total documents in the collection
    const total = await OAuthClientsModel.countDocuments({
      user_id: req.user.user_id,
    });

    res.status(OK)
      .json({
        applications,
        total: total,
        limit: parseInt(limit),
        page: parseInt(page),
      })
  } catch (error) {
    res.status(error.code || INTERNAL_SERVER).json(error instanceof Error ? {error: error.message} : error);
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
    res.status(error.code || INTERNAL_SERVER).json(error instanceof Error ? {error: error.message} : error);
  }
}

const updateApplication = async (req, res) => {
  try {
    const {
      name,
      description,
      callback_url
    } = req.body;
    const {id} = req.params;
    const result = await OAuthClientsModel.findByIdAndUpdate(id, {
      name,
      description,
      callback_url,
      updated_at: Date.now(),
    }, {
      new: true
    });

    res.status(OK)
      .json({
        data: result,
      });
  } catch (error) {
    res.status(error.code || INTERNAL_SERVER).json(error instanceof Error ? {error: error.message} : error);
  }
}

const removeApplication = async (req, res) => {
  try {
    const {id} = req.params;
    // TODO: soft delete
    const app = await OAuthClientsModel.findByIdAndDelete(id);
    if (!app) {
      return res.status(NOT_FOUND)
        .json({
          error: "The application not found.",
        });
    }

    res.status(OK)
      .json({
        data: app,
      });
  } catch (error) {
    res.status(error.code || INTERNAL_SERVER).json(error instanceof Error ? {error: error.message} : error);
  }
}

module.exports = {
  getApplications,
  createApplication,
  updateApplication,
  removeApplication,
}