const express = require('express');
const {asyncHandler} = require("../utils/async_handler.utils");
const {
  getSpreadSheet,
  getSpreadSheetValue
} = require("../controllers/ggsheet.controller");
const router = express.Router();

router.get('/spread/sheet/:spreadsheetId', asyncHandler(getSpreadSheet));
router.get('/spread/sheet/:spreadsheetId/value', asyncHandler(getSpreadSheetValue));

module.exports = router;
