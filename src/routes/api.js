const express = require('express');
const {authenticate} = require("../services/oauth2.service");
const {createUser} = require("../models/user");
const {findUserByEmail, validatePassword} = require("../services/user.service");
const {generateAccessToken} = require("../services/token-handler.service");
const {VALIDATION_ERROR} = require("../utils/httpStatusCode");
const router = express.Router();

router.get('/ping', (req, res) => {
  res.status(200).json({
    data: "PONG"
  });
});

router.post('/login', async (req, res) => {
  console.log(req.body);
  try {
    const {email, password} = req.body;
    /// Find user by email
    const user = await findUserByEmail(email);
    /// Validate the password from request with user's password
    await validatePassword(password, user);
    /// Sign and return back the access token
    const accessToken = generateAccessToken({
      user_id: user.id,
      email: user.email,
      name: user.name,
    });

    res.json({
      accessToken
    });
  } catch (error) {
    res.status(error.code || 500).json(error instanceof Error ? {error: error.message} : error);
  }
});

router.get('/protected-test', authenticate, (req, res) => {
  res.json({
    message: "Data here",
  });
});

router.post('/users', (req, res) => {
  createUser(req.body)
    .then(response => {
      res.send({
        success: true,
        data: response
      });
    })
    .catch(err => {
      res.status(VALIDATION_ERROR).json({
        "error": err.message,
      });
    });
});

module.exports = router;