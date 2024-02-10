const {FORBIDDEN, NOT_FOUND} = require("../../utils/status_code.util");
const BaseError = require("../BaseError");

class RefreshTokenError extends BaseError {
  constructor(
    message,
    code = FORBIDDEN,
  ) {
    super(message, code)
  }
}

class RefreshTokenNotFoundError extends BaseError {
  constructor(
    message,
    code = NOT_FOUND,
  ) {
    super(message, code)
  }
}

module.exports = {
  RefreshTokenError,
  RefreshTokenNotFoundError,
}