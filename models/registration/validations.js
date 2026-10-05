const Joi = require('joi');
const { objectId } = require('../../utils/validationHelpers');

const registerSchema = Joi.object({
  eventId: objectId.required(),
});

const idParamSchema = Joi.object({
  id: objectId.required(),
});

const eventIdParamSchema = Joi.object({
  eventId: objectId.required(),
});

const eventRegistrationsQuerySchema = Joi.object({
  status: Joi.string().valid('REGISTERED', 'CANCELLED'),
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
});

module.exports = {
  registerSchema,
  idParamSchema,
  eventIdParamSchema,
  eventRegistrationsQuerySchema,
};
