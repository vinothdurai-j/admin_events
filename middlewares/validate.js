// Runs a Joi schema on req.body / req.params / req.query.
// //Usage: validate(schema)  or  validate(schema, 'params')
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // collect all errors
      stripUnknown: true, // remove fields we did not define
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map((item) => item.message),
      });
    }

    req[property] = value; // use the cleaned values
    next();
  };
};

module.exports = validate;
