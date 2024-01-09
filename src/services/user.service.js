const {UserModels} = require("../models/user");
const bcrypt = require("bcrypt");
const winstonElasticsearch = require('winston-elasticsearch');
const UnprocessableEntityError = require("../error-handler/UnprocessableEntityError");

const findUserByEmail = async (email) => {
  const user = await UserModels.findOne({email});
  if (!user) {
    throw new Error(`User with email (${email}) not found.`);
  }

  return user;
}

const validatePassword = async (password, user) => {
  const res = await bcrypt.compare(password, user.password);
  if (!res) {
    throw new UnprocessableEntityError(`The password with user: ${user.email} is incorrect.`);
  }
}

module.exports = {
  findUserByEmail,
  validatePassword,
}