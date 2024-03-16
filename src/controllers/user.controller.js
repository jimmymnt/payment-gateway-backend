const {CREATED, OK, INTERNAL_SERVER} = require("../utils/status_code.util");
const {createUser} = require("../services/user.service");
const {findUserById} = require("../models/user.model");
const createInternalUser = async (req, res) => {
  const response = await createUser(req.body)
  res.status(CREATED).json({
    success: true,
    data: response
  });
}

const updateInternalUser = async (req, res) => {
  const {id} = req.params;
  const result = await findUserById(id);

  if (result instanceof Error) {
    return res.status(result.code ?? INTERNAL_SERVER)
      .json({
        error: result.message ?? 'error.internal_server_error',
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