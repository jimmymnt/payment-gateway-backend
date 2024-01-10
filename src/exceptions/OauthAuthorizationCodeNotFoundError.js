const {NOT_FOUND} = require("../utils/status_code.util");
const BaseError = require("./BaseError");

class OauthAuthorizationCodeNotFoundError extends BaseError {
  constructor(
    message,
    code = NOT_FOUND,
  ) {
    super(message, code)
  }
}

module.exports = {
  OauthAuthorizationCodeNotFoundError
};