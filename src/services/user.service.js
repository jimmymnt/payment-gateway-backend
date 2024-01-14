const {UserModel} = require("../models/user.model");
const bcrypt = require("bcrypt");
const {UnprocessableEntityError} = require("../exceptions/UnprocessableEntityError");
const {UserNotFoundError} = require("../exceptions/UserNotFoundError");
const {v4: uuid} = require("uuid");

const findUserByEmail = async (email) => {
  const user = await UserModel.findOne({email});
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

const createUser = async (information) => {
  const {
    name,
    email,
    password,
    phone,
  } = information;

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  const user = await UserModel.create({
    id: uuid(),
    name,
    email,
    phone,
    password: hash
  });

  return {
    id: user.id,
    name: user.name,
    phone: user.phone,
    email: user.email,
  }
};

module.exports = {
  createUser,
  findUserByEmail,
  validatePassword,
}