const express = require('express');
const controller = require('../controller');
const validate = require('../../../middlewares/validate');
const { authenticate, isAdmin, isUser } = require('../../../middlewares/auth');
const {
  registerSchema,
  idParamSchema,
  eventIdParamSchema,
  eventRegistrationsQuerySchema,
} = require('../validations');

const router = express.Router();

// ---------- User ----------
router.post('/', authenticate, isUser, validate(registerSchema), controller.register);
router.get('/my', authenticate, isUser, controller.getMyRegistrations);
router.patch(
  '/:id/cancel',
  authenticate,
  isUser,
  validate(idParamSchema, 'params'),
  controller.cancelRegistration
);

// ---------- Admin ----------
router.get(
  '/event/:eventId',
  authenticate,
  isAdmin,
  validate(eventIdParamSchema, 'params'),
  validate(eventRegistrationsQuerySchema, 'query'),
  controller.getEventRegistrations
);

module.exports = router;
