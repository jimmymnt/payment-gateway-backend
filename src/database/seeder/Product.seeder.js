const {faker} = require('@faker-js/faker');
const mongoose = require('mongoose');
const configs = require("../../configs");
const {Product} = require("../../models/product.model");
const {PUBLISHED} = require("../../constants/Product.constant");

const createRandomProduct = () => {
  return {
    title: faker.commerce.productName(),
    shortDescription: faker.word.words(30),
    description: faker.commerce.productDescription(),
    thumbnail: faker.image.urlLoremFlickr({category: 'abstract'}),
    price: faker.number.int({
      min: 120,
      max: 10000,
    }),
    stock: faker.number.int({
      min: 20,
      max: 100,
    }),
    status: PUBLISHED,
    sku: faker.commerce.isbn(13),
    images: [
      faker.image.urlLoremFlickr({category: 'abstract'}),
      faker.image.urlLoremFlickr({category: 'abstract'}),
      faker.image.urlLoremFlickr({category: 'abstract'}),
      faker.image.urlLoremFlickr({category: 'abstract'}),
      faker.image.urlLoremFlickr({category: 'abstract'}),
      faker.image.urlLoremFlickr({category: 'abstract'}),
    ],
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
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
    const product = await Product.create(createRandomProduct());
    console.log(`Created product ${product.title}`);
  }
  console.log('DONE');
  await mongoose.disconnect();
});