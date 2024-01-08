const {UserModels} = require("../models/user");
const bcrypt = require("bcrypt");
const winstonElasticsearch = require('winston-elasticsearch');
const UnprocessableEntityError = require("../error-handler/UnprocessableEntityError");
const logger = require("../utils/logger");

const findUserByEmail = async (email) => {
  const user = await UserModels.findOne({email});
  if (!user) {
    logger.debug(`Can not find user with the email ${email}`);
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