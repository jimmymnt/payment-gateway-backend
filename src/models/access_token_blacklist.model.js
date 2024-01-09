const mongoose = require('mongoose');
const {MongooseError} = require("mongoose");
const {Schema} = mongoose;

const UserTokenBlacklist = new Schema({
  user_id: {
    type: mongoose.ObjectId,
    required: [
      true,
      "User ID field is required.",
    ]
  },
  token: {
    type: String,
    required: [
      true, "Token field is required."
    ],
  },
  reason: {
    type: String,
    default: "Token expired",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const UserTokenBlackListModel = mongoose.model("TokenBlacklist", UserTokenBlacklist, "user_token_blacklists");

const createBlacklistToken = async (information) => {
  try {
    const {
      user_id,
      token,
      reason,
    } = information;

    const tokenRecord = await UserTokenBlackListModel.create({
      user_id,
      token,
      reason,
    });

    return {
      user_id,
      token,
      reason,
      created_at: tokenRecord.created_at,
    }
  } catch (error) {
    throw new MongooseError(
      `Can not create token blacklist with information ${information}`
    );
  }
};

module.exports = {
  UserTokenBlackListModel,
  createBlacklistToken,
}