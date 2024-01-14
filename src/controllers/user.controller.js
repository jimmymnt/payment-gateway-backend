const {CREATED, UNPROCESSABLE_ENTITY, NOT_FOUND, OK, INTERNAL_SERVER} = require("../utils/status_code.util");
const {createUser} = require("../services/user.service");
const {findUserById} = require("../models/user.model");
const createInternalUser = (req, res) => {
  createUser(req.body)
    .then(response => {
      res.status(CREATED).json({
        success: true,
        data: response
      });
    })
    .catch(err => {
      res.status(UNPROCESSABLE_ENTITY).json({
        "error": err.message,
      });
    });
}

const updateInternalUser = async (req, res) => {
  const {id} = req.params;
  const result = await findUserById(id);

  if (result instanceof Error) {
    console.log(result);
    return res.status(result.code ?? INTERNAL_SERVER)
      .json({
        error: result.message ?? "Internal Server Error",
      });
  }

  res.status(OK)
    .json({
      data: result,
    });
}

module.exports = {
  createInternalUser,
  updateInternalUser,
}