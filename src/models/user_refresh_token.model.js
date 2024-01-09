const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const {v4: uuid} = require("uuid");

const {Schema} = mongoose;

const UserRefreshToken = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    required: [
      true,
      "User ID field is required."
    ]
  },
  token: {
    type: String,
    required: [
      true,
      "The token field is required."
    ]
  },
  created_at: {
    type: Date,
    default: Date.now,
    expires: 30 * 24 * 60 * 60 // 30 days
  },
});

const UserRefreshTokenModel = mongoose.model("UserRefreshToken", UserRefreshToken, "user_refresh_tokens");

const generateRefreshToken = async (user) => {
  const data = {
    user_id: user.id,
  }

  /// Sign the refresh token
  const token = jwt.sign(
    data,
    process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY,
    {
      expiresIn: '30d'
    }
  )

  /// Remove the old one.
  await UserRefreshTokenModel.deleteOne({
    user_id: user._id,
  });

  /// Create the new one.
  const refreshToken = await UserRefreshTokenModel.create({
    user_id: user._id,
    token,
  });

  return refreshToken;
};

module.exports = {
  UserRefreshTokenModel,
  generateRefreshToken,
}