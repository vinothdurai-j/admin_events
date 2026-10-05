// Common response helpers so every API returns the same shape.

const sendSuccess = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({ success: true, message, data });
};

const sendError = (res, error) => {
  let statusCode = error.statusCode || 500;
  let message = error.message;

  // Mongo duplicate key (for example same email / same registration twice)
  if (error.code === 11000) {
    statusCode = 409;
    message = 'Duplicate data found';
  }

  // Wrong ObjectId format
  if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid id';
  }

  if (statusCode === 500) {
    console.log('Server error:', error);
    message = 'Something went wrong';
  }

  return res.status(statusCode).json({ success: false, message });
};

module.exports = { sendSuccess, sendError };
