const express = require('express');
const {authorize, token, authenticate} = require("../services/oauth2.service");
const router = express.Router();

/**
 * @openapi
 * /oauth/authorize:
 *  get:
 *     tags:
 *     - OAuth Flows
 *     description: Authorize client
 *     parameters:
 *        - name: Client ID
 *          in: path
 *          description: ID of the client
 *          required: true
 *        - name: Response Type
 *          in: path
 *          description: Response type of authorization, types are supported [code]
 *          required: true
 *     responses:
 *       200:
 *         description: Authorized
 *       404:
 *         description: Client not found in the system
 *       400:
 *         description: Bad Request, missing params
 */
router.get('/authorize', authorize);

router.post('/token', token);

/**
 * API to authenticate
 * @method authenticate
 * @header {string} token - Bearer token
 */
router.get('/authenticate', authenticate);

module.exports = router;