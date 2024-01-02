const express = require('express');
const {authenticate} = require("../services/oauth2.service");
const {createUser} = require("../models/user");
const router = express.Router();

router.post('/login', (req, res) => {
  console.table(req.body);

  res.json({
    "message": "Logged in",
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