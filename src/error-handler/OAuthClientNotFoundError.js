const {NOT_FOUND} = require("../utils/httpStatusCode");
const BaseError = require("./BaseError");

class OAuthClientNotFoundError extends BaseError {
  constructor(
    message,
    code = NOT_FOUND,
  ) {
    super(message, code)
  }
}

module.exports = OAuthClientNotFoundError