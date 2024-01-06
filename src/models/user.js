const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uuid = require('uuid').v4;
const jwt = require("jsonwebtoken");
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
  },
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return /^(0\d{9,10})$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
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

User.methods.generateAccessToken = function () {
  const token = jwt.sign({
    id: this.id,
    email: this.email,
    name: this.name,
  }, process.env.JWT_SECRET_KEY, {
    expiresIn: '1h'
  });

  return token;
}

const UserModels = mongoose.model("User", User, "users");

const createUser = async (information) => {
  const {
    name,
    email,
    password,
    phone,
  } = information;

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  const user = await UserModels.create({
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

async function validateEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regex.test(email)) {
    throw new Error("Email is not valid email.");
  }

  const existed = await this.constructor.findOne({email})
  if (!!existed) throw new Error("A user is already registered with this email address.")
}

module.exports = {
  UserModels,
  createUser,
}