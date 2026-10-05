const express = require('express');
const controller = require('../controller');
const validate = require('../../../middlewares/validate');
const { loginSchema } = require('../validations');

const router = express.Router();

// POST /api/admin/login
router.post('/login', validate(loginSchema), controller.login);

module.exports = router;
