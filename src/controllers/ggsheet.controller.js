const {
  getAuthToken,
  getSpreadSheetDetail,
  getSpreadSheetDetailValues
} = require("../services/gooleSheet.sevice");
const {OK} = require("../utils/status_code.util");

const getSpreadSheet = async (req, res) => {
  const auth = await getAuthToken();
  const {spreadsheetId} = req.params;
  const response = await getSpreadSheetDetail({
    spreadsheetId,
    auth
  });

  res.status(OK).json({
    data: response.data
  });
}

const getSpreadSheetValue = async (req, res) => {
  const auth = await getAuthToken();
  const {spreadsheetId} = req.params;
  const {
    sheet_name,
    range
  } = req.body;
  const response = await getSpreadSheetDetailValues({
    spreadsheetId,
    auth,
    range: `${sheet_name}!${range}`,
  });

  res.status(OK).json({
    data: response.data
  });
}

module.exports = {
  getSpreadSheet,
  getSpreadSheetValue,
}