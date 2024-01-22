const {UNPROCESSABLE_ENTITY} = require("../utils/status_code.util");
const BaseError = require("./BaseError");

class MissingParameterPayloadError extends BaseError {
  constructor(
    message,
    code = UNPROCESSABLE_ENTITY,
  ) {
    super(message, code)
  }
}

module.exports = {
  MissingParameterPayloadError,
}