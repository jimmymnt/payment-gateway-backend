const uuid = require('uuid').v4;
const mongoose = require('mongoose');
const {Schema} = mongoose;

const User = new Schema({
  name: {
    type: String,
    require: false,
  },
  password: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
});

const UserModels = mongoose.model("User", User, "users");

module.exports = {
  UserModels,
}
