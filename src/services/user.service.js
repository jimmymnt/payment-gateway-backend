const {UserModels} = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const findUserByEmail = async (email) => {
  const user = await UserModels.findOne({email});
  if (!user) {
    throw new Error("User with this email not found.");
  }

  return user;
}

const validatePassword = (password, user) => {
  bcrypt.compare(password, user.password, function (err, result) {
    if (err instanceof Error) {
      throw new Error("Password is incorrect.");
    }
  });
}

const generateAccessToken = (information) => {
  const token = jwt.sign(information, process.env.JWT_SECRET_KEY, {
    expiresIn: '1h'
  });

  return token;
}

module.exports = {
  findUserByEmail,
  validatePassword,
  generateAccessToken,
}