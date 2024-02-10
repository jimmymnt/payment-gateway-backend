const {faker} = require('@faker-js/faker');

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

module.exports = {
  createRandomProduct,
}