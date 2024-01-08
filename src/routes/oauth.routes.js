const express = require('express');
const {authorize, token, authenticate} = require("../services/oauth2.service");
const {oauthApplication} = require("../services/application.service");
const auth = require("../middleware/auth");
const router = express.Router();

router.post('/apps', auth, oauthApplication);

router.get('/authorize', authorize);

router.post('/token', token);

router.post('/token/refresh', token);

router.get('/authenticate', authenticate);

module.exports = router;