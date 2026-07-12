const authService = require("../services/auth.service");
const { signupSchema, loginSchema } = require("../validators/auth.validator");
const { sendSuccess } = require("../utils/response");
const Messages = require("../constants/messages");
const asyncHandler = require("../utils/asyncHandler");

const signup = asyncHandler(async (req, res) => {
  const parsedData = signupSchema.parse(req.body);

  const { user, token } = await authService.signup(parsedData);

  return sendSuccess(
    res,
    Messages.AUTH.SIGNUP_SUCCESS,
    { user, token },
    201
  );
});

const login = asyncHandler(async (req, res) => {
  const parsedData = loginSchema.parse(req.body);

  const { user, token } = await authService.login(parsedData.email, parsedData.password);

  return sendSuccess(
    res,
    Messages.AUTH.LOGIN_SUCCESS,
    { user, token },
    200
  );
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);

  return sendSuccess(
    res,
    "User profile retrieved successfully",
    { user },
    200
  );
});

const logout = asyncHandler(async (req, res) => {
  return sendSuccess(
    res,
    Messages.AUTH.LOGOUT_SUCCESS,
    {},
    200
  );
});

module.exports = {
  signup,
  login,
  getMe,
  logout,
};
