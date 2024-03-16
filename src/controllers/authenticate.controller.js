const {findUserByEmail, validatePassword} = require("../services/user.service");
const {OK} = require("../utils/status_code.util");
const {logoutHandler, refreshTokenHandler} = require("../services/user.authenticate.service");

const login = async (req, res) => {
  const {email, password} = req.body;
  /// Find user by email
  const user = await findUserByEmail(email);
  /// Validate the password from request with user's password
  await validatePassword(password, user);
  /// Sign and return back the access token
  const {accessToken, refreshToken} = await user.generateAccessToken();
  res.status(OK).json({
    accessToken,
    refreshToken,
  });
}

const refreshToken = async (req, res) => {
  const {refresh_token} = req.body;
  const token = await refreshTokenHandler(refresh_token);

  // await blacklistOldToken(refresh_token);
  // res.send(OK);

  res.status(OK).json({
    message: "token_refreshed",
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
  });
}

const updatePassword = (req, res) => {
  const {
    current_password,
    new_password,
    confirmation_password
  } = req.body;

  console.log(current_password, new_password, confirmation_password);
}

/// Logout the user from the system
/// - Add the token into `blacklist` collection
const logout = async (req, res) => {
  const result = await logoutHandler(req);
  if (!!result) {
    res.status(OK)
      .json({
        message: 'authenticate.succeed',
      });
  }
}

module.exports = {
  login,
  refreshToken,
  updatePassword,
  logout,
}