const express = require('express');
const {authorize, token, authenticate} = require("../services/oauth2.service");
const router = express.Router();

/// Oauth flow routes
router.get('/authorize', authorize);
router.post('/token', token);
router.post('/token/refresh', token);
router.get('/authenticate', authenticate);

module.exports = router;