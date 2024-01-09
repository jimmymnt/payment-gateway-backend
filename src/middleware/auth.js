const jwt = require("jsonwebtoken");
const {FORBIDDEN, UNAUTHORIZED} = require("../utils/status_code.util");

const auth = (req, res, next) => {
  try {
    let token = req.header('Authorization');
    if (!token) {
      return res.status(FORBIDDEN).json({
        error: "Access denied. Seem like you haven't provided Authorization token, yet."
      });
    }

    token = token.split(' ');

    if (token.length !== 2) {
      return res.status(FORBIDDEN).json({
        error: "Token is invalid.",
      });
    }

    const accessToken = token[1];
    req.user = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    next();
  } catch (error) {
    res.status(UNAUTHORIZED).json({
      error: "Unauthorized",
    });
  }
};

module.exports = auth;