const BaseError = require("./BaseError");
const {UNPROCESSABLE_ENTITY} = require("../utils/status_code.util");

class UnprocessableEntityError extends BaseError {
  constructor(
    message,
    code = UNPROCESSABLE_ENTITY,
  ) {
    super(message, code)
  }
}

module.exports = UnprocessableEntityError