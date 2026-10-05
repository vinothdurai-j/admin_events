// Creates the first admin automatically (values come from .env)
const adminService = require('../models/admin/service');

const seedAdmin = async () => {
  try {
    await adminService.createDefaultAdmin();
  } catch (error) {
    console.log('Could not create default admin:', error.message);
  }
};

module.exports = seedAdmin;
