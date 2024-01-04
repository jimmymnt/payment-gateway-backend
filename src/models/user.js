const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {validateEmail} = require("../services/user.service");
const uuid = require('uuid').v4;
const {Schema} = mongoose;

const User = new Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: [true, "Name field is required."],
  },
  password: {
    type: String,
    required: [true, "Password field is required."],
    select: false,
  },
  email: {
    type: String,
    validate: {
      validator: validateEmail,
      message: props => `${props.value} has already been taken!`
    },
    required: [true, 'User email field is required'],
  },
});

const UserModels = mongoose.model("User", User, "users");

const createUser = async (information) => {
  const {
    name,
    email,
    password
  } = information;

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  const user = await UserModels.create({
    id: uuid(),
    name,
    email,
    password: hash
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  }
};

module.exports = {
  UserModels,
  createUser,
}