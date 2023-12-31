const uuid = require('uuid');
const mongoose = require('mongoose');
const {Schema} = mongoose;

const OAuthClients = new Schema({
  user_id: {
    type: String,
    require: true,
  },
  client_id: {
    type: String,
    require: true,
  },
  client_secret: {
    type: String,
    require: true,
  },
  callback_url: {
    type: String,
    require: true,
  },
  grants: {
    type: [String],
    required: true,
    enum: ["authorization_code", "refresh_token"]
  }
});

const OAuthAuthorizationCodes = new Schema({
  authorization_code: {
    type: String
  },
  expires_at: {
    type: Date
  },
  redirect_uri: {
    type: String
  },
  scope: {
    type: String
  },
  client_id: {
    type: String
  },
  user_id: {
    type: String
  },
});

const OAuthAccessTokens = new Schema({
  access_token: {
    type: String
  },
  access_token_expires_at: {
    type: Date
  },
  scope: {
    type: String
  },
  client_id: {
    type: String
  },
  user_id: {
    type: String
  }
});

const OAuthRefreshTokens = new Schema({
  refresh_token: {
    type: String
  },
  refresh_token_expires_at: {
    type: Date
  },
  scope: {
    type: String
  }, // not sure if this is needed
  client_id: {
    type: String
  },
  user_id: {
    type: String
  },
});

const OAuthClientsModel = mongoose.model("OAuthClients", OAuthClients);
const OAuthAuthorizationCodesModel = mongoose.model("OAuthAuthorizationCodes", OAuthAuthorizationCodes);
const OAuthAccessTokensModel = mongoose.model("OAuthAccessTokens", OAuthAccessTokens);
const OAuthRefreshTokensModel = mongoose.model("OAuthRefreshTokens", OAuthRefreshTokens);

/**
 * Get an OAuth2 Client.
 *
 * Called in 1. Authorization and 4. Refresh Token.
 * 'clientSecret' is defined when refreshing the token.
 */
async function getClient(client_id, client_secret) {
  const client = await OAuthClientsModel.findOne({
    client_id,
    ...(client_secret && {client_secret})
  }).lean();

  if (!client) {
    throw new Error("Client not found");
  }

  return {
    id: client.clientId,
    grants: client.grants,
    redirectUris: [client.callback_url]
  };
}

/**
 * Save authorization code.
 */
async function saveAuthorizationCode(code, client, user) {
  const authorizationCode = {
    authorizationCode: code.authorizationCode,
    redirectUri: code.redirectUri,
    scope: code.scope,
    clientId: client.id,
    userId: user._id
  };

  await OAuthAuthorizationCodesModel.create({_id: uuid(), ...authorizationCode});
  return authorizationCode;
}

/**
 * Get authorization code.
 */
async function getAuthorizationCode(authorizationCode) {
  const code = await OAuthAuthorizationCodesModel.findOne({authorizationCode}).lean();
  if (!code) throw new Error("Authorization code not found");

  return {
    code: code.authorizationCode,
    expiresAt: code.expiresAt,
    redirectUri: code.redirectUri,
    scope: code.scope,
    client: {id: code.clientId},
    user: {id: code.userId}
  };
}

/**
* Revoke authorization code.
*/
async function revokeAuthorizationCode({code}) {
  const res = await OAuthAuthorizationCodesModel.deleteOne({authorization_code: code});
  return res.deletedCount === 1;
}

/**
 * Revoke a refresh token.
 */
async function revokeToken({refresh_token}) {
  const res = await OAuthAccessTokensModel.deleteOne({refresh_token});
  return res.deletedCount === 1;
}

/**
 * Save token.
 */
async function saveToken(token, client, user) {
  await OAuthAccessTokensModel.create({
    access_token: token.access_token,
    access_token_expires_at: token.access_token_expires_at,
    scope: token.scope,
    _id: uuid(),
    clientId: client.id,
    userId: user.id
  });

  if (token.refresh_token) {
    await OAuthRefreshTokensModel.create({
      refresh_token: token.refresh_token,
      refresh_token_expires_at: token.refresh_token_expires_at,
      scope: token.scope,
      _id: uuid(),
      client_id: client.id,
      user_id: user.id
    });
  }

  return {
    access_token: token.access_token,
    access_token_expires_at: token.access_token_expires_at,
    refresh_token: token.refresh_token,
    refresh_tokenExpires_at: token.refresh_token_expires_at,
    scope: token.scope,
    client: {id: client.id},
    user: {id: user.id},
  };
}

/**
 * Get access token.
 */
async function getAccessToken(access_token) {
  const token = await OAuthAccessTokensModel.findOne({access_token}).lean();
  if (!token) throw new Error("Access token not found");

  return {
    access_token: token.access_token,
    access_token_expires_at: token.access_token_expires_at,
    scope: token.scope,
    client: {id: token.clientId},
    user: {id: token.userId}
  };
}

/**
 * Get refresh token.
 */
async function getRefreshToken(refresh_token) {
  const token = await OAuthRefreshTokensModel.findOne({refresh_token}).lean();
  if (!token) throw new Error("Refresh token not found");

  return {
    refresh_token: token.refresh_token,
    // refreshTokenExpiresAt: token.refreshTokenExpiresAt, // never expires
    scope: token.scope,
    client: {id: token.client_id},
    user: {id: token.userId}
  };
}

module.exports = {
  saveToken,
  saveAuthorizationCode,
  revokeAuthorizationCode,
  revokeToken,
  getAuthorizationCode,
  getAccessToken,
  getClient,
  getRefreshToken
}