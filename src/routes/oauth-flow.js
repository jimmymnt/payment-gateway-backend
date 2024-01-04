const express = require('express');
const {authorize, token, authenticate} = require("../services/oauth2.service");
const router = express.Router();



router.get('/authorize', authorize);

/**
 * API to get Token from Authorization Server
 * @method token
 * @param {string} client_id - ID of Oauth Client.
 * @param {string} client_secret - Secret Key of Oauth Client.
 * @param {string} grant_type - Type ['authorization_code', 'refresh_token'].
 * @param {string} code - Code from `/authorize` endpoint.
 * @param {string} redirect_uri - URL to redirect back after authorized.
 */
router.post('/token', token);

/**
 * API to authenticate
 * @method authenticate
 * @header {string} token - Bearer token
 */
router.get('/authenticate', authenticate);

module.exports = router;