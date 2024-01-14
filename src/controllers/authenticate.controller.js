const {findUserByEmail, validatePassword} = require("../services/user.service");
const {OK} = require("../utils/status_code.util");
const {logoutHandler, refreshTokenHandler} = require("../services/user.authenticate.service");

const login = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(error.code || 500).json(error instanceof Error ? {error: error.message} : error);
  }
}

const refreshToken = async (req, res) => {
  try {
    const {refresh_token} = req.body;
    const token = await refreshTokenHandler(refresh_token);

    // await blacklistOldToken(refresh_token);
    // res.send(OK);

    res.status(OK).json({
      message: "New access token has been generated.",
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    });
  } catch (error) {
    res.status(error.code || 500).json(error instanceof Error ? {error: error.message} : error);
  }
}

const updatePassword = (req, res) => {
  try {
    const {
      current_password,
      new_password,
      confirmation_password
    } = req.body;

    console.log(current_password, new_password, confirmation_password);
  } catch (error) {
    res.status(error.code || 500).json(error instanceof Error ? {error: error.message} : error);
  }
}

/// Logout the user from the system
/// - Add the token into `blacklist` collection
const logout = async (req, res) => {
  try {
    const result = await logoutHandler(req);
    if (!! result) {
      res.status(OK)
        .json({
          message: 'Logged out',
        });
    }
  } catch (error) {
    res.status(error.code || 500).json(error instanceof Error ? {error: error.message} : error);
  }
}

module.exports = {
  login,
  refreshToken,
  updatePassword,
  logout,
}