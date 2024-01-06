const BaseError = require("./BaseError");
const {UNPROCESSABLE_ENTITY} = require("../utils/HTTPStatusCode");

class UnprocessableEntityError extends BaseError {
  constructor(
    message,
    code = UNPROCESSABLE_ENTITY,
  ) {
    super(message, code)
  }
}

module.exports = UnprocessableEntityError