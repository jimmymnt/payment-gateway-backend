const express = require('express');
const {authenticate} = require("../services/oauth2.service");
const {createUser} = require("../models/user");
const router = express.Router();

router.post('/login', (req, res) => {

  res.json({
    "message": "Logged in",
  });
});

router.get('/protected-test', authenticate, (req, res) => {
  res.json({
    "message": "Data here",
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