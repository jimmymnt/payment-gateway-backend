const express = require('express');
const {getProducts, createProducts} = require("../controllers/product.controller");
const upload = require("../middleware/upload.middleware");
const router = express.Router();

/// Product
router.get('/products', getProducts);

router.post('/products', upload.fields([
  {name: 'thumbnail', maxCount: 1},
  {name: 'images', maxCount: 15}
]), createProducts);


module.exports = router;