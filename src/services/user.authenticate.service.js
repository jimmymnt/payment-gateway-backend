const {RefreshTokenError} = require("../error-handler/RefreshTokenError");
const {UserRefreshTokenModel} = require("../models/UserRefreshToken");
const jwt = require("jsonwebtoken");
const {UserModels} = require("../models/user");
const UserNotFoundError = require("../error-handler/UserNotFoundError");

const refreshToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new RefreshTokenError("Missing parameter: `refresh_token`");
  }

  const privateRefreshKey = process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY;
  const token = await UserRefreshTokenModel.findOne({token: refreshToken});
  if (!token) {
    throw new RefreshTokenError("Refresh Token invalid.");
  }

  const tokenDetails = jwt.verify(refreshToken, privateRefreshKey);
  const user = await UserModels.findOne({id: tokenDetails.user_id});

  if (!user) {
    throw new UserNotFoundError("User not found.");
  }

  const newTokens = await user.generateAccessToken();

  return {
    accessToken: newTokens.accessToken,
    refreshToken: newTokens.refreshToken,
  };
}

module.exports = {
  refreshToken,
}