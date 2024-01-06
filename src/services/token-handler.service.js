const jwt = require("jsonwebtoken");

const generateAccessToken = (information) => {
  const token = jwt.sign(information, process.env.JWT_SECRET_KEY, {
    expiresIn: '1h'
  });

  return token;
}

module.exports = {
  generateAccessToken,
}