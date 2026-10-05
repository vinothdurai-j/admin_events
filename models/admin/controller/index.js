const adminService = require('../service');
const { sendSuccess, sendError } = require('../../../utils/response');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await adminService.loginAdmin(email, password);
    return sendSuccess(res, 200, 'Admin login successful', result);
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = { login };
