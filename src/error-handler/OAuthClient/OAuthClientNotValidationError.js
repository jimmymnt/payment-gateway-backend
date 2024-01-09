const BaseError = require("../BaseError");
const {VALIDATE_ERROR} = require('../../utils/status_code.util');

class OAuthClientNotValidationError extends BaseError {
  constructor(
    message,
    code = VALIDATE_ERROR,
  ) {
    super(message, code)
  }
}

module.exports = OAuthClientNotValidationError