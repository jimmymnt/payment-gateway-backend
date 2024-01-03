const mongoose = require('mongoose');
const {InvalidTokenError} = require("@node-oauth/oauth2-server");
const {Schema} = mongoose;

const OAuthClients = new Schema({
  client_id: {
    type: String,
    require: true,
  },
  user_id: {
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
  id: {
    type: String,
    require: true,
  },
  authorization_code: {
    type: String,
    require: true,
  },
  expires_at: {
    type: Date,
    require: true,
  },
  redirect_uri: {
    type: String,
    require: true,
  },
  scope: {
    type: String,
    require: true,
  },
  client_id: {
    type: String,
    require: true,
  },
  user_id: {
    type: String,
    require: true,
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
    type: String,
  },
  user_id: {
    type: String
  }
});

const OAuthRefreshTokens = new Schema({
  id: {
    type: String,
    require: true,
  },
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
    type: String,
  },
  user_id: {
    type: String
  },
});

const OAuthClientsModel = mongoose.model("OAuthClients", OAuthClients, "oauth_clients");
const OAuthAuthorizationCodesModel = mongoose.model("OAuthAuthorizationCodes", OAuthAuthorizationCodes, "oauth_authorization_codes");
const OAuthAccessTokensModel = mongoose.model("OAuthAccessTokens", OAuthAccessTokens, "oauth_access_tokens");
const OAuthRefreshTokensModel = mongoose.model("OAuthRefreshTokens", OAuthRefreshTokens, "oauth_refresh_tokens");

/**
 * Get an OAuth2 Client.
 *
 * Called in 1. Authorization and 4. Refresh Token.
 * 'clientSecret' is defined when refreshing the token.
 */
async function getClient(client_id, client_secret) {
  console.log('getClient:', client_id, client_secret);
  const client = await OAuthClientsModel.findOne({
    client_id: client_id,
    ...(client_secret && {client_secret})
  });

  if (!client) {
    throw new Error("Client not found 3");
  }

  const data = {
    id: client.client_id,
    grants: client.grants,
    redirectUris: [client.callback_url],
    userId: client.user_id,
  };
  console.log('getClient: return data', data);
  return data;
}

/**
 * Save authorization code.
 */
async function saveAuthorizationCode(code, client, user) {
  console.log('saveAuthorizationCode');
  console.log('code: ', code);
  console.log('client:', client);
  console.log('user:', user);
  const authorizationCode = {
    authorization_code: code.authorizationCode,
    redirect_uri: code.redirectUri,
    expires_at: code.expiresAt,
    scope: code.scope,
    client_id: client.id,
    user_id: client.userId
  };

  await OAuthAuthorizationCodesModel.create({...authorizationCode});
  return {
    authorizationCode: code.authorizationCode,
    expiresAt: code.expiresAt,
    redirectUri: code.redirectUri,
    scope: code.scope,
    client: {id: client.id},
    user: {id: client.userId}
  };
}

/**
 * Get authorization code.
 */
async function getAuthorizationCode(authorization_code) {
  console.log('getAuthorizationCode: ', authorization_code);
  const code = await OAuthAuthorizationCodesModel.findOne({authorization_code});
  if (!code) throw new Error("Authorization code not found");
  console.log('getAuthorizationCode code:', code);

  return {
    code: code.authorization_code,
    expiresAt: code.expires_at,
    redirectUri: code.redirect_uri,
    scope: code.scope,
    client: {id: code.client_id},
    user: {id: code.user_id}
  };
}

/**
 * Revoke authorization code.
 */
async function revokeAuthorizationCode({code}) {
  console.log('revokeAuthorizationCode:', code);
  const res = await OAuthAuthorizationCodesModel.deleteOne({authorization_code: code});
  return res.deletedCount === 1;
}

/**
 * Revoke a refresh token.
 */
async function revokeToken(token) {
  console.log('revokeToken:', token);
  const res = await OAuthRefreshTokensModel.deleteOne({refresh_token: token.refreshToken});
  return res.deletedCount === 1;
}

/**
 * Save token.
 */
async function saveToken(token, client, user) {
  console.log('saveToken:', token, client, user);
  await OAuthAccessTokensModel.create({
    access_token: token.accessToken,
    access_token_expires_at: token.accessTokenExpiresAt,
    scope: token.scope,
    client_id: client.id,
    user_id: client.userId
  });

  if (token.refreshToken) {
    await OAuthRefreshTokensModel.create({
      refresh_token: token.refreshToken,
      refresh_token_expires_at: token.refreshTokenExpiresAt,
      scope: token.scope,
      client_id: client.id,
      user_id: client.userId
    });
  }

  return {
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt,
    refreshToken: token.refreshToken,
    refreshTokenExpiresAt: token.refreshTokenExpiresAt,
    scope: token.scope,
    client: {id: client.id},
    user: {id: client.userId},
  };
}

/**
 * Get access token.
 */
async function getAccessToken(access_token) {
  console.log('getAccessToken:', access_token);
  const token = await OAuthAccessTokensModel.findOne({access_token}).lean();
  if (!token) throw new InvalidTokenError("Unauthorized");
  console.log('token from here:', token);

  return {
    accessToken: token.access_token,
    accessTokenExpiresAt: token.access_token_expires_at,
    scope: token.scope,
    client: {id: token.client_id},
    user: {id: token.user_id}
  };
}

/**
 * Get refresh token.
 */
async function getRefreshToken(refresh_token) {
  console.log('getRefreshToken:', refresh_token);
  const token = await OAuthRefreshTokensModel.findOne({refresh_token}).lean();
  if (!token) throw new Error("Refresh token not found");

  return {
    refreshToken: token.refresh_token,
    refreshTokenExpiresAt: token.refresh_token_expires_at,
    scope: token.scope,
    client: {id: token.client_id},
    user: {id: token.userId}
  };
}

module.exports = {
  OAuthClientsModel,
  saveToken,
  saveAuthorizationCode,
  revokeAuthorizationCode,
  revokeToken,
  getAuthorizationCode,
  getAccessToken,
  getClient,
  getRefreshToken
}