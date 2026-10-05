const Joi = require('joi');

// A valid MongoDB ObjectId is a 24 character hex string
const objectId = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .messages({ 'string.pattern.base': '{{#label}} must be a valid id' });

module.exports = { objectId };
