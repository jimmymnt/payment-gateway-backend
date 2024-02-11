const {faker} = require('@faker-js/faker');
const mongoose = require('mongoose');
const configs = require("../../configs");
const {PUBLISHED} = require("../../constants/Product.constant");
const {User} = require("../../models/user.model");
const bcrypt = require("bcrypt");

const createRandomUser = () => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync('pwd@2024', salt);
  return {
    id: crypto.randomUUID(),
    name: faker.person.fullName(),
    password: hash,
    email: faker.internet.email(),
  };
}

function connect() {
  mongoose.connection
    .on('error', console.log)
    .on('disconnected', console.log);
  return mongoose.connect(configs.db);
}

connect().then(async res => {
  for (let i = 0; i < 100; i++) {
    const user = await User.create(createRandomUser());
    console.log(`Created user ${user.email}`);
  }
  console.log('DONE');
  await mongoose.disconnect();
});