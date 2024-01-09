const BaseError = require("./BaseError");
const {UNPROCESSABLE_ENTITY} = require("../utils/status_code.util");
const logger = require("../utils/logger.util");

class UnprocessableEntityError extends BaseError {
  constructor(
    message,
    code = UNPROCESSABLE_ENTITY,
  ) {
    // logger.error(`${__filename}: code: ${code} - ${message}`);
    // logger.error(new Error("fdasfds"));
    super(message, code)
  }
}

module.exports = UnprocessableEntityError