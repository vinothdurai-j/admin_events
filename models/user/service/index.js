const bcrypt = require('bcrypt');
const User = require('../model');
const createError = require('../../../utils/createError');
const { generateToken } = require('../../../utils/token');

const registerUser = async (data) => {
  const email = data.email.toLowerCase();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(409, 'Email already registered');
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    name: data.name,
    email,
    password: hashedPassword,
    phone: data.phone,
  });

  const token = generateToken({ id: user._id, role: 'user' });

  return {
    token,
    user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: 'user' },
  };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw createError(401, 'Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createError(401, 'Invalid email or password');
  }

  const token = generateToken({ id: user._id, role: 'user' });

  return {
    token,
    user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: 'user' },
  };
};

const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw createError(404, 'User not found');
  }
  return user;
};

module.exports = { registerUser, loginUser, getProfile };
