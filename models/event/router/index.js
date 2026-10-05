const express = require('express');
const controller = require('../controller');
const validate = require('../../../middlewares/validate');
const { authenticate, isAdmin } = require('../../../middlewares/auth');
const {
  createEventSchema,
  updateEventSchema,
  statusSchema,
  idParamSchema,
  listQuerySchema,
  adminListQuerySchema,
} = require('../validations');

const router = express.Router();

// ---------- Admin only ----------
// NOTE: '/admin/list' must be above '/:id', otherwise "admin" is read as an id
router.get(
  '/admin/list',
  authenticate,
  isAdmin,
  validate(adminListQuerySchema, 'query'),
  controller.getAllEventsForAdmin
);
router.post('/', authenticate, isAdmin, validate(createEventSchema), controller.createEvent);
router.put(
  '/:id',
  authenticate,
  isAdmin,
  validate(idParamSchema, 'params'),
  validate(updateEventSchema),
  controller.updateEvent
);
router.patch(
  '/:id/status',
  authenticate,
  isAdmin,
  validate(idParamSchema, 'params'),
  validate(statusSchema),
  controller.updateEventStatus
);
router.delete(
  '/:id',
  authenticate,
  isAdmin,
  validate(idParamSchema, 'params'),
  controller.deleteEvent
);

// ---------- Any logged-in user ----------
router.get('/', authenticate, validate(listQuerySchema, 'query'), controller.getActiveEvents);
router.get('/:id', authenticate, validate(idParamSchema, 'params'), controller.getEventById);

module.exports = router;
