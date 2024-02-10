const {RefreshTokenError} = require("../exceptions/Token/RefreshTokenError");
const {UserRefreshTokenModel} = require("../models/user_refresh_token.model");
const jwt = require("jsonwebtoken");
const {User} = require("../models/user.model");
const {UserNotFoundError} = require("../exceptions/User/UserNotFoundError");
const {TokenInvalidError} = require("../exceptions/Token/TokenInvalidError");
const {iLogger} = require("../utils/logger.util");
const {createBlacklistToken} = require("../models/access_token_blacklist.model");

const refreshTokenHandler = async (refreshToken) => {
  if (!refreshToken) {
    throw new RefreshTokenError("Missing parameter: `refresh_token`");
  }

  const privateRefreshKey = process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY;
  const token = await UserRefreshTokenModel.findOne({token: refreshToken});
  if (!token) {
    throw new RefreshTokenError("Refresh Token invalid.");
  }

  const tokenDetails = jwt.verify(refreshToken, privateRefreshKey);
  const user = await User.findOne({id: tokenDetails.user_id});

  if (!user) {
    throw new UserNotFoundError("User not found.");
  }

  const newTokens = await user.generateAccessToken();

  return {
    accessToken: newTokens.accessToken,
    refreshToken: newTokens.refreshToken,
  };
}

/// Logout the user from the system
/// - Add the token into `blacklist` collection
const logoutHandler = async (req) => {
  /// Get token from Authorization Header
  let token = req.header('Authorization');
  token = token.split(' ');
  if (token.length !== 2) {
    iLogger.error(`A user tried to authenticate but token not valid`);
    throw new TokenInvalidError('Token is invalid');
  }
  const accessToken = token[1];

  /// Check if this token is valid or not
  const tokenDetails = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

  /// Add this token into our blacklist to prevent further more use
  if (tokenDetails) {
    await createBlacklistToken({
      user_id: tokenDetails.user_id,
      token: accessToken,
      reason: "logged out",
    });
  }

  return true;
}

module.exports = {
  logoutHandler,
  refreshTokenHandler,
}