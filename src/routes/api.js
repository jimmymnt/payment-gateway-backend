const express = require('express');
const {authenticate} = require("../services/oauth2.service");
const {createUser} = require("../models/user");
const router = express.Router();

/**
 * @openapi
 * /api/v1/ping:
 *  get:
 *     tags:
 *     - Ping
 *     description: Returns API operational status
 *     responses:
 *       200:
 *         description: API is  running
 *       400:
 *         description: Bad request
 */
router.get('/ping', (req, res) => {
  res.status(200).json({
    data: "PONG"
  });
});

/**
 * @openapi
 * /api/v1/login:
 *  post:
 *     tags:
 *     - Login
 *     description: Login to the system
 *     requestBody:
 *        - content:
 *            application
 *
 *        - name: Email
 *          in: path
 *          description: Email
 *          required: true
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       400:
 *         description: Bad request
 */
router.post('/login', (req, res) => {
  res.json({
    message: "Logged in",
  });
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
      res.status(422).json({
        "error": err.message,
      });
    });
});

module.exports = router;