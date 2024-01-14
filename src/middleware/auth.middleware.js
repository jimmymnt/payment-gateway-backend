const jwt = require("jsonwebtoken");
const { FORBIDDEN, UNAUTHORIZED } = require("../utils/status_code.util");
const { UserTokenBlackListModel } = require("../models/access_token_blacklist.model");
const { iLogger } = require("../utils/logger.util");

const authMiddleware = async (req, res, next) => {
  iLogger.info(
    `Request to ${req.originalUrl} with method: ${req.method} and IP: ${req.ip}`
  );
  try {
    let token = req.header('Authorization');
    if (!token) {
      return res.status(FORBIDDEN).json({
        error: "Access denied. Seem like you haven't provided Authorization token, yet."
      });
    }

    /// Get token from Authorization Header
    token = token.split(' ');
    if (token.length !== 2) {
      iLogger.error('A user tried to authenticate but token not valid.');
      return res.status(FORBIDDEN).json({
        error: "Token is invalid.",
      });
    }
    const accessToken = token[1];

    /// Check that token is in Blacklist?
    /// TODO Make a request to check Blacklist Token from Redis instead of MongoDB
    const existedBlacklist = await UserTokenBlackListModel.exists({ token: accessToken });
    if (!!existedBlacklist) {
      iLogger.error('This token has been rejected by the system');
      return res.status(FORBIDDEN).json({
        error: "This token has been rejected by the system.",
      });
    }

    /// Token is valid or not?
    req.user = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    next();
  } catch (error) {
    res.status(UNAUTHORIZED).json({
      error: "Unauthorized",
    });
  }
};

module.exports = {
  auth: authMiddleware,
}