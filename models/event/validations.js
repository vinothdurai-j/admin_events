const Joi = require('joi');
const { objectId } = require('../../utils/validationHelpers');

const STATUS_VALUES = ['ACTIVE', 'INACTIVE'];

const createEventSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required(),
  description: Joi.string().trim().min(5).max(1000).required(),
  category: Joi.string().trim().max(50).required(),
  location: Joi.string().trim().max(150).required(),
  eventDate: Joi.date().iso().greater('now').required(), // must be a future date
  maxParticipants: Joi.number().integer().min(1).required(),
  status: Joi.string().valid(...STATUS_VALUES), // optional, default is ACTIVE
});

// Every field is optional while editing, but at least one must be sent
const updateEventSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100),
  description: Joi.string().trim().min(5).max(1000),
  category: Joi.string().trim().max(50),
  location: Joi.string().trim().max(150),
  eventDate: Joi.date().iso().greater('now'),
  maxParticipants: Joi.number().integer().min(1),
}).min(1);

const statusSchema = Joi.object({
  status: Joi.string().valid(...STATUS_VALUES).required(),
});

const idParamSchema = Joi.object({
  id: objectId.required(),
});

// Query for user event list: /api/events?search=...&category=...
const listQuerySchema = Joi.object({
  search: Joi.string().trim().allow(''),
  category: Joi.string().trim().allow(''),
  location: Joi.string().trim().allow(''),
  fromDate: Joi.date().iso(),
  toDate: Joi.date().iso(),
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(50),
});

// Admin can also filter by status
const adminListQuerySchema = listQuerySchema.keys({
  status: Joi.string().valid(...STATUS_VALUES),
});

module.exports = {
  createEventSchema,
  updateEventSchema,
  statusSchema,
  idParamSchema,
  listQuerySchema,
  adminListQuerySchema,
};
