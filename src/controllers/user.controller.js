const {iLogger} = require("../utils/logger.util");
const jwt = require("jsonwebtoken");
const {TokenInvalidError} = require("../exceptions/TokenInvalidError");
const {createBlacklistToken} = require("../models/access_token_blacklist.model");

/// Logout the user from the system
/// - Add the token into `blacklist` collection
const logout = async (req) => {
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
  logout,
}