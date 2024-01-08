const jwt = require("jsonwebtoken");
const {FORBIDDEN, UNAUTHORIZED} = require("../utils/HTTPStatusCode");

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(FORBIDDEN).json({
        error: "Access denied. Seem like you haven't provided Authorization token, yet."
      });
    }

    req.user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    next();
  } catch (error) {
    res.status(UNAUTHORIZED).json({
      error: "Unauthorized",
    });
  }
};

module.exports = auth;