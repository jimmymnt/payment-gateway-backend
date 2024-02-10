const {FORBIDDEN} = require("../../utils/status_code.util");
const BaseError = require("../BaseError");

class TokenInvalidError extends BaseError {
  constructor(
    message,
    code = FORBIDDEN,
  ) {
    super(message, code)
  }
}

module.exports = {
  TokenInvalidError,
}