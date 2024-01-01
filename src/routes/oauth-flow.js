const express = require('express');
const { authorize, token, authenticate, test} = require("../services/oauth2.service");
const router = express.Router();

router.get('/authorize', authorize);
router.post('/token', token);
router.get('/authenticate', authenticate, test);

module.exports = router;
