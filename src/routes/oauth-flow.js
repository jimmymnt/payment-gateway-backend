const express = require('express');
const {authorize, token, authenticate} = require("../services/oauth2.service");
const router = express.Router();

/**
 * @api {get} /authorize Request Authorization
 * @apiName Authorize
 * @apiGroup Oauth
 *
 * @apiParam None.
 *
 * @apiSuccess {String} client_id Client ID of the User.
 * @apiSuccess {String} response_type Type of the Authorization.
 */
router.get('/authorize', authorize);
router.post('/token', token);
router.get('/authenticate', authenticate);

module.exports = router;