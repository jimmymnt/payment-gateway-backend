const OAuth2Server = require('@node-oauth/oauth2-server');
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;
const OAuth = require("../models/oauth.model");
const {OAuthClientsModel} = require("../models/oauth.model");
const {UserModels} = require("../models/user.model");
const {OAuthClientNotFoundError} = require("../exceptions/OAuthClientNotFoundError");
const {UserNotFoundError} = require("../exceptions/UserNotFoundError");

const server = new OAuth2Server({
  model: OAuth // See https://github.com/oauthjs/node-oauth2-server for specification
});

// IMPORTANT: this the first route to be called in the process.
// node-oauth2-server requires us to define a function called
// `authenticateHandler` that authenticate the user initiating the flow.

// This means that:
// 1. A User is authenticating through a Client, hence you need to search
// for a valid Client in the DB using `client_id` provided as parameter;
// 2. A User is authenticating via the authorization screen (same as you do
// when adding a new app to GitHub, and it asks you what organization or
// privileges do you want to grant the app. The bonus of this article is
// that very screen).

// The library says that if you don't need to authenticate the user, you can
// return a falsy value. This didn't work for me, so I'm not recommending it
// here.

const authorize = async (req, res) => {
  const request = new Request(req);
  const response = new Response(res);
  return server
    .authorize(request, response, {
      authenticateHandler: {
        handle: async () => {
          // Present in Flow 1 and Flow 2 ('client_id' is a required for /oauth/authorize
          const {client_id} = req.query || {};
          if (!client_id) throw new Error("Client ID not found 111");
          // console.log(client_id);
          const client = await OAuthClientsModel.findOne({client_id: client_id});
          if (!client) throw new OAuthClientNotFoundError("Client not found 222");
          // Only present in Flow 2 (authentication screen)
          const {user_id} = req.auth || {};
          // At this point, if there's no 'user_id' attached to the client
          // or the request doesn't originate from an authentication screen,
          // then do not bind this authorization code to any user, just the client
          if (!client.user_id && !user_id) return {}; // falsy value
          const user = await UserModels.findOne({id: client.user_id});
          console.log("user:", user);
          if (!user) throw new UserNotFoundError("User not found 333");
          return user;
        }
      },
      allowEmptyState: true,
    })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log("err", err);
      res.status(err.code || 500).json(err instanceof Error ? {error: err.message} : err);
    });
};

const token = (req, res) => {
  const request = new Request(req);
  const response = new Response(res);
  return server
    .token(request, response, {alwaysIssueNewRefreshToken: false})
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log("err", err);
      res.status(err.code || 500).json(err instanceof Error ? {error: err.message} : err);
    });
};

const authenticate = (req, res, next) => {
  const request = new Request(req);
  const response = new Response(res);
  return server
    .authenticate(request, response)
    .then((data) => {
      req.auth = {user_id: data?.user?.id, sessionType: "oauth2"};
      next();
    })
    .catch((err) => {
      console.log("err", err);
      res.status(err.code || 401).json(err instanceof Error ? {error: err.message} : err);
    });
};

module.exports = {server, authorize, token, authenticate};