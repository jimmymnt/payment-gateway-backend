const express = require('express');
const {OK} = require("../utils/status_code.util");
const {auth} = require("../middleware/auth.middleware");
const {
  getApplications,
  createApplication,
  updateApplication,
  removeApplication
} = require("../controllers/application.controller");
const {login, refreshToken, updatePassword, logout} = require("../controllers/authenticate.controller");
const {createInternalUser, updateInternalUser} = require("../controllers/user.controller");
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

/// Internal User routes
router.post('/users', auth, createInternalUser);
router.put('/users/:id', auth, updateInternalUser);

router.get('/protected-test', auth, (req, res) => {
  res.json({
    message: "Data here",
  });
});


module.exports = router