const {FORBIDDEN} = require("../../utils/status_code.util");
const BaseError = require("../BaseError");
const {iLogger} = require("../../utils/logger.util");

class ForbiddenTokenError extends BaseError {
  constructor(
    message,
    code = FORBIDDEN,
  ) {
    iLogger.error(message);
    super(message, code)
  }
}

module.exports = {
  ForbiddenTokenError,
}