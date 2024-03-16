const {google} = require('googleapis');
const path = require("node:path");
const sheets = google.sheets('v4');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

async function getAuthToken() {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, '../../service_account_credentials.json'),
    scopes: SCOPES,
  });

  return await auth.getClient();
}

async function getSpreadSheetDetail({spreadsheetId, auth}) {
  return await sheets.spreadsheets.get({
    spreadsheetId,
    auth,
  });
}

async function getSpreadSheetDetailValues({spreadsheetId, auth, range}) {
  return await sheets.spreadsheets.values.get({
    spreadsheetId,
    auth,
    range
  });
}

module.exports = {
  getAuthToken,
  getSpreadSheetDetail,
  getSpreadSheetDetailValues
}