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
 *        - name: client_id
 *          in: query
 *          description: ID of the client
 *          required: true
 *        - name: response_type
 *          in: query
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

/**
 * @openapi
 * /oauth/token:
 *  post:
 *     tags:
 *     - OAuth Flows
 *     description: Get Token and related information.
 *     requestBody:
 *        content:
 *         application/x-www-form-urlencoded:
 *            schema:
 *              type: object
 *              required:
 *                - client_id
 *                - client_secret
 *                - grant_type
 *                - code
 *                - redirect_uri
 *              properties:
 *                client_id:
 *                  type: string
 *                  description: Client ID
 *                client_secret:
 *                  type: string
 *                  description: Client secret
 *                grant_type:
 *                  type: string
 *                  description: Grant Type
 *                code:
 *                  type: string
 *                  description: Authorization Code
 *                redirect_uri:
 *                  type: string
 *                  description: Client Redirect URL (Callback URL)
 *     responses:
 *       200:
 *         description: Successfully
 *       404:
 *         description: Client not found in the system
 *       400:
 *         description: Bad Request, missing body content
 *       50x:
 *         description: Error Service Unavailable
 */
router.post('/token', token);

/**
 * @openapi
 * /oauth/token/refresh:
 *  post:
 *     tags:
 *     - OAuth Flows
 *     description: Refresh Token.
 *     components:
 *        securitySchemes:
 *            BasicAuth:
 *                type: http
 *                scheme: basic
 *     requestBody:
 *        content:
 *         application/x-www-form-urlencoded:
 *            schema:
 *              type: object
 *              required:
 *                - grant_type
 *                - refresh_token
 *              properties:
 *                grant_type:
 *                  type: string
 *                  description: Grant Type [refresh_token]
 *                refresh_token:
 *                  type: string
 *                  description: Refresh Token value
 *     responses:
 *       200:
 *         description: Successfully
 *       404:
 *         description: Client not found in the system
 *       400:
 *         description: Bad Request, missing Basic Auth or body content
 *       50x:
 *         description: Error Service Unavailable
 */
router.post('/token/refresh', token);

/**
 * @openapi
 * /api/v1/protected-test:
 *  get:
 *     tags:
 *     - Retrieve data after authentication
 *     components:
 *        securitySchemes:
 *          bearerAuth:
 *            type: http
 *            scheme: bearer
 *     security:
 *         - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authorized
 *       404:
 *         description: Client not found in the system
 *       400:
 *         description: Bad Request, missing params
 *       50x:
 *         description: Error Service Unavailable
 */
router.get('/authenticate', authenticate);

module.exports = router;