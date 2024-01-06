const BaseError = require("../BaseError");
const {VALIDATE_ERROR} = require('../../utils/httpStatusCode');

class OAuthClientNotValidationError extends BaseError {
  constructor(
    message,
    code = VALIDATE_ERROR,
  ) {
    super(message, code)
  }
}

module.exports = OAuthClientNotValidationError