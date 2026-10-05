// Creates an error that also carries an HTTP status code.
// Services use this:  throw createError(404, 'Event not found');
const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

module.exports = createError;
