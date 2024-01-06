const express = require('express');
const {createOAuthApplication} = require("../services/application.service");
const router = express.Router();

router.post('/apps', createOAuthApplication);

module.exports = router;