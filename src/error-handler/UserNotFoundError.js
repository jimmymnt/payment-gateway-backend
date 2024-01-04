const {NOT_FOUND} = require("../utils/httpStatusCode");
const BaseError = require("./BaseError");

class UserNotFoundError extends BaseError {
  constructor(
    message,
    code = NOT_FOUND,
  ) {
    super(message, code)
  }
}

module.exports = UserNotFoundError