const {UserModels} = require("../models/user.model");
const bcrypt = require("bcrypt");
const winstonElasticsearch = require('winston-elasticsearch');
const {UnprocessableEntityError} = require("../exceptions/UnprocessableEntityError");
const {UserNotFoundError} = require("../exceptions/UserNotFoundError");

const findUserByEmail = async (email) => {
  const user = await UserModels.findOne({email});
  if (!user) {
    throw new UserNotFoundError(`User with email (${email}) not found.`);
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