const mongoose = require('mongoose');
const {ProductNotFoundError} = require("../exceptions/Product/ProductNotFoundError");
const {INTERNAL_SERVER} = require("../utils/status_code.util");
const {DRAFT, PUBLISHED, BANNED} = require("../constants/Product.constant");
const {Schema} = mongoose;

const ProductSchema = new Schema({
  title: {
    type: String,
    required: [true, "Product title field is required."],
  },
  status: {
    type: String,
    enum: [DRAFT, PUBLISHED, BANNED],
    default: DRAFT,
  },
  shortDescription: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: [true, "Product description field is required."],
  },
  thumbnail: {
    type: String,
    required: [true, "Main image field is required."],
  },
  sku: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: [true, "The price field is required."],
  },
  stock: {
    type: Number,
    required: [true, "The stock field is required."],
  },
  images: {
    type: Array,
    required: [true, "The images field is required."],
  },
  owner: {
    type: Schema.Types.ObjectId, ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", ProductSchema);

const findProductById = async (id) => {
  try {
    const user = await Product.findOne({
      _id: id,
    }).select('-__v').exec();

    if (!user) {
      return new ProductNotFoundError(`Can not find the product with ID is ${id}`);
    }

    return user;
  } catch (error) {
    return new ProductNotFoundError(`Error: ${error.message}`, INTERNAL_SERVER);
  }
}


module.exports = {
  Product,
  findProductById,
}