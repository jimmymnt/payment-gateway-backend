const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const {UserModel} = require("./user.model");
const {Schema} = mongoose;

const UserTokenBlacklist = new Schema({
  user_id: {
    type: String,
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
    throw new Error(
      `Can not create token blacklist with reason: ${error.message}`
    );
  }
};

const blacklistOldToken = async (refreshToken) => {
  const res = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY);
  console.log(res);
}

module.exports = {
  UserTokenBlackListModel,
  createBlacklistToken,
  blacklistOldToken,
}