// Main entry point of the application
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const routes = require('./routes');
const seedAdmin = require('./utils/seedAdmin');

const app = express();

// Middlewares that run for every request
app.use(cors());
app.use(express.json());

// Simple health check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Mini Event Management API is running' });
});

// All APIs start with /api
app.use('/api', routes);

// If no route matched
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB(); // 1. connect database
  await seedAdmin(); // 2. create default admin if needed
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // 3. start server
};

startServer();
