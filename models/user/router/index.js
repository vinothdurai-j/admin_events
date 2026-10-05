const express = require('express');
const controller = require('../controller');
const validate = require('../../../middlewares/validate');
const { authenticate, isUser } = require('../../../middlewares/auth');
const { registerSchema, loginSchema } = require('../validations');

const router = express.Router();

// POST /api/user/register
router.post('/register', validate(registerSchema), controller.register);

// POST /api/user/login
router.post('/login', validate(loginSchema), controller.login);

// GET /api/user/profile  (login required)
router.get('/profile', authenticate, isUser, controller.getProfile);

module.exports = router;
