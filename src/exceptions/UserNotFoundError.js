const {NOT_FOUND} = require("../utils/status_code.util");
const BaseError = require("./BaseError");
const logger = require("../utils/logger.util");

class UserNotFoundError extends BaseError {
  constructor(
    message,
    code = NOT_FOUND,
  ) {
    // logger.error(`${__filename}: code: ${code} - ${message}`);
    logger.error(new Error("fdsafdsa"));
    super(message, code)
  }
}

module.exports = UserNotFoundError