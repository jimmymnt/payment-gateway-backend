const express = require('express');
const {authenticate} = require("../services/oauth2.service");
const {createUser} = require("../models/user");
const router = express.Router();

router.post('/login', (req, res) => {
  console.log(req.body);

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
      res.json({
        "error": err.message,
      }, 422);
    });
});

module.exports = router;