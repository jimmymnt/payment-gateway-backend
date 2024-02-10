const express = require('express');
const {OK} = require("../utils/status_code.util");
const {auth} = require("../middleware/auth.middleware");
const {login, refreshToken, updatePassword, logout} = require("../controllers/authenticate.controller");
const {createInternalUser, updateInternalUser} = require("../controllers/user.controller");
const {asyncHandler} = require("../utils/async_handler.utils");
const router = express.Router();

router.get('/ping', (req, res) => {
  res.status(OK).json({
    data: "PONG"
  });
});

/// Authentication
router.post('/login', asyncHandler(login));
router.post('/token/refresh', asyncHandler(refreshToken));
router.post('/logout', auth, asyncHandler(logout));
router.put('/users/password/update', auth, asyncHandler(updatePassword));
/// Internal User routes

router.post('/users', asyncHandler(createInternalUser));
router.put('/users/:id', auth, updateInternalUser);

router.get('/protected-test', auth, (req, res) => {
  res.json({
    message: "Data here",
  });
});

module.exports = router;