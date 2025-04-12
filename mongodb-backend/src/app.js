const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes'); // Import user routes

// Load environment variables
dotenv.config();

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/barbershop_income_tracker';
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true, // Add this option to avoid the deprecation warning
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1); // Exit the application if the connection fails
  });

// Test route
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'Test route is working!' });
});

// Use user routes
app.use('/api/users', userRoutes); // Mount user routes under /api/users

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});