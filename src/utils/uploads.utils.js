const path = require("path");
const fs = require("fs");
const {padTo2Digits} = require("./date.util");

/**
 *
 * @returns {string | *}
 */
const uploadPath = () => {
  const today = new Date();
  const currentYear = (today.getFullYear());
  const currentMonth = padTo2Digits(today.getMonth() + 1);
  const uploadPathFolder = path.join(__dirname, `./../../public/uploads/${currentYear}/${currentMonth}`);
  if (!fs.existsSync(uploadPathFolder)) {
    fs.mkdirSync(uploadPathFolder, {recursive: true});
  }

  return uploadPathFolder;
}

module.exports = {
  uploadPath,
}