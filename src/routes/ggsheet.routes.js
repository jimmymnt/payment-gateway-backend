const express = require('express');
const {asyncHandler} = require("../utils/async_handler.utils");
const {
  getSpreadSheet,
  getSpreadSheetValue
} = require("../controllers/ggsheet.controller");
const {auth} = require("../middleware/auth.middleware");
const router = express.Router();

router.get('/spread/sheet/:spreadsheetId', auth, asyncHandler(getSpreadSheet));
router.get('/spread/sheet/:spreadsheetId/value', auth, asyncHandler(getSpreadSheetValue));

module.exports = router;
