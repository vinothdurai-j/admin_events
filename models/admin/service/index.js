const bcrypt = require('bcrypt');
const Admin = require('../model');
const createError = require('../../../utils/createError');
const { generateToken } = require('../../../utils/token');

// const loginAdmin = async (email, password) => {
//   // password is hidden by default, so we ask for it with select('+password')
//   const admin = await Admin.findOne({ email }).select('+password');
//   if (!admin) {
//     throw createError(401, 'Invalid email or password');
//   }

//   const isMatch = await bcrypt.compare(password, admin.password);
//   if (!isMatch) {
//     throw createError(401, 'Invalid email or password');
//   }

//   const token = generateToken({ id: admin._id, role: 'admin' });

//   return {
//     token,
//     admin: { id: admin._id, name: admin.name, email: admin.email, role: 'admin' },
//   };
// };



const loginAdmin = async (email, password) => {

  // Get admin by email
  const admin = await Admin.findOne({ email }).select('+password');

  if (!admin) {
    throw createError(401, 'Invalid email or password');
  }

  // Compare plain-text password
  const isMatch = password === admin.password;

  if (!isMatch) {
    throw createError(401, 'Invalid email or password');
  }

  const token = generateToken({
    id: admin._id,
    role: 'admin'
  });

  return {
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: 'admin'
    }
  };
};



// // Called once when the server starts
// const createDefaultAdmin = async () => {
//   const adminCount = await Admin.countDocuments();
//   if (adminCount > 0) return;

//   const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
//   await Admin.create({
//     name: process.env.ADMIN_NAME || 'Super Admin',
//     email: process.env.ADMIN_EMAIL,
//     password: hashedPassword,
//   });
//   console.log('Default admin created:', process.env.ADMIN_EMAIL);
// };

// module.exports = { loginAdmin, createDefaultAdmin };


// Called once when the server starts

const createDefaultAdmin = async () => {

  const adminCount = await Admin.countDocuments();

  if (adminCount > 0) return;

  await Admin.create({

    name: process.env.ADMIN_NAME || 'Super Admin',

    email: process.env.ADMIN_EMAIL,

    password: process.env.ADMIN_PASSWORD,

  });

  console.log('Default admin created:', process.env.ADMIN_EMAIL);

};

module.exports = { loginAdmin, createDefaultAdmin };


