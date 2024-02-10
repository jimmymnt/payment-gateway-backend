const {OK, INTERNAL_SERVER} = require("../utils/status_code.util");
const {Product} = require("../models/product.model");
const Resize = require("../services/Resize.service");
const fs = require("fs");
const {urlWithPath} = require("../utils/url.untils");
const {uploadPath} = require("../utils/uploads.utils");

const getProducts = async (req, res) => {
  try {
    const limit = req.params.limit ? req.params.limit : 10;
    const page = req.params.page ? req.params.page : 1;
    const products = await Product.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .sort('-createdAt');
    const productTotal = await Product.countDocuments();

    res.status(OK).json({
      products,
      page,
      limit,
      total: productTotal,
    });
  } catch (error) {
    res.status(error.code || INTERNAL_SERVER).json(error instanceof Error ? {error: error.message} : error);
  }
}

const createProducts = async (req, res) => {
  try {
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
      message: "Product created",
      product,
    });
  } catch (error) {
    res.status(error.code || INTERNAL_SERVER).json(error instanceof Error ? {error: error.message} : error);
  }
}

module.exports = {
  getProducts,
  createProducts,
}