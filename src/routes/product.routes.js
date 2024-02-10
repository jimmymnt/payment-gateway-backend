const express = require('express');
const {
  getProducts,
  createProducts,
  getProduct,
  deleteProduct
} = require("../controllers/product.controller");
const upload = require("../middleware/upload.middleware");
const {asyncHandler} = require("../utils/async_handler.utils");
const router = express.Router();

/// Product
router.get('/products', asyncHandler(getProducts));

router.get('/products/:id', asyncHandler(getProduct));

router.post('/products', upload.fields([
  {name: 'thumbnail', maxCount: 1},
  {name: 'images', maxCount: 15}
]), asyncHandler(createProducts));

router.delete('/products/:id', asyncHandler(deleteProduct));

module.exports = router;