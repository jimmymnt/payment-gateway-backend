const {UserModels} = require("../models/user");
const bcrypt = require("bcrypt");
const UnprocessableEntityError = require("../error-handler/UnprocessableEntityError");

const findUserByEmail = async (email) => {
  const user = await UserModels.findOne({email});
  if (!user) {
    throw new UnprocessableEntityError("User with this email not found.");
  }

  return user;
}

const validatePassword = async (password, user) => {
  const res = await bcrypt.compare(password, user.password);
  if (!res) {
    throw new UnprocessableEntityError("The password is incorrect.");
  }
}

module.exports = {
  findUserByEmail,
  validatePassword,
}