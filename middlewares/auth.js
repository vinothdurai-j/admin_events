const { verifyToken } = require('../utils/token');

// 1. Checks the JWT token and puts { id, role } into req.user
const authenticate = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Please login first' });
  }

  const token = header.split(' ')[1];

  try {
    req.user = verifyToken(token);
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

// 2. Only admin can pass
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access only' });
  }
  next();
};

// 3. Only normal user can pass
const isUser = (req, res, next) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({ success: false, message: 'User access only' });
  }
  next();
};

module.exports = { authenticate, isAdmin, isUser };
