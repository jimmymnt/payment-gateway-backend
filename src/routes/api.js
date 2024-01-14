const express = require('express');
const {createUser} = require("../models/user.model");
const {CREATED, OK, UNPROCESSABLE_ENTITY} = require("../utils/status_code.util");
const {auth} = require("../middleware/auth");
const {blacklistOldToken} = require("../models/access_token_blacklist.model");
const {
  getApplications,
  createApplication,
  updateApplication,
  removeApplication
} = require("../controllers/application.controller");
const {login, refreshToken, updatePassword, logout} = require("../controllers/authenticate.controller");
const router = express.Router();

router.get('/ping', (req, res) => {
  res.status(OK).json({
    data: "PONG"
  });
});

/// Authentication
router.post('/login', login);
router.post('/token/refresh', refreshToken);
router.post('/logout', auth, logout);
router.put('/users/password/update', auth, updatePassword);

/// Application routes
router.get('/apps', auth, getApplications);
router.post('/apps', auth, createApplication);
router.put('/apps/:id', auth, updateApplication);
router.delete('/apps/:id', auth, removeApplication);

router.get('/protected-test', auth, (req, res) => {
  res.json({
    message: "Data here",
  });
});

router.post('/users', auth, (req, res) => {
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
});

module.exports = router