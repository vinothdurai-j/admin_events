const userService = require('../service');
const { sendSuccess, sendError } = require('../../../utils/response');

const register = async (req, res) => {
  try {
    const result = await userService.registerUser(req.body);
    return sendSuccess(res, 201, 'User registered successfully', result);
  } catch (error) {
    return sendError(res, error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userService.loginUser(email, password);
    return sendSuccess(res, 200, 'Login successful', result);
  } catch (error) {
    return sendError(res, error);
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await userService.getProfile(req.user.id);
    return sendSuccess(res, 200, 'Profile fetched', user);
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = { register, login, getProfile };
