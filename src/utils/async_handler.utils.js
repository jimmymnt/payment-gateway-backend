const {INTERNAL_SERVER} = require("./status_code.util");

const asyncHandler = fn => (req, res, next) => {
  return Promise.resolve(fn(req, res, next))
    .catch((error) => {
      res.status(error.code || INTERNAL_SERVER)
        .json(error instanceof Error ? {error: error.message} : error);
    });
}

module.exports = {
  asyncHandler
};