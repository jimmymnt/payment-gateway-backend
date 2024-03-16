const {OK} = require("../utils/status_code.util");
const {Product} = require("../models/product.model");
const Resize = require("../services/Resize.service");
const fs = require("fs");
const {urlWithPath} = require("../utils/url.untils");
const {uploadPath} = require("../utils/uploads.utils");
const {PUBLISHED} = require("../constants/Product.constant");

const getProducts = async (req, res) => {
  const limit = req.query.limit ? req.query.limit : 10;
  const page = req.query.page ? req.query.page : 1;
  const products = await Product.find({})
    .select('-__v')
    .sort('-createdAt')
    .where({
      status: PUBLISHED
    })
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();
  const productTotal = await Product.countDocuments({
    status: PUBLISHED
  });

  res.status(OK).json({
    products,
    page,
    limit,
    total: productTotal,
  });
}

const getProduct = async (req, res) => {
  const {id} = req.params;
  const product = await Product.findById(id)
    .select('-__v')
    .exec();

  res.status(OK).json(product);
}

const createProducts = async (req, res) => {
  // folder upload
  const {absolutePath, relativePath} = uploadPath();
  console.log(absolutePath, relativePath);
  const thumbnailFile = req.files['thumbnail'][0];
  const imagesFile = req.files['images'];

  const fileUpload = new Resize(absolutePath);
  // Storage Thumbnail
  const thumbnailPath = await fileUpload.save(thumbnailFile, 768, 422);
  if (thumbnailPath) {
    fs.unlinkSync(thumbnailFile.path);
  }

  // Storage Images
  const productImages = [];
  for (const image of imagesFile) {
    const filename = await fileUpload.save(image, 768, 422);
    const productImage = urlWithPath(req, relativePath + filename);
    if (filename) {
      productImages.unshift(productImage);
      fs.unlinkSync(image.path);
    }
  }

  const product = await Product.create({
    ...req.body,
    thumbnail: urlWithPath(req, relativePath + thumbnailPath),
    images: productImages,
  });

  return res.status(OK).json({
    message: 'product.created',
    product,
  });
}

const deleteProduct = async (req, res) => {
  const {id} = req.params;
  await Product.findByIdAndDelete(id);

  res.status(OK).json({
    message: 'product.removed',
  });
}

module.exports = {
  getProducts,
  getProduct,
  createProducts,
  deleteProduct,
}