class BaseError extends Error {
  constructor(message, code) {
    super(message)

    Object.setPrototypeOf(this, new.target.prototype)
    this.message = message
    this.code = code
    Error.captureStackTrace(this)
  }
}

module.exports = BaseError;