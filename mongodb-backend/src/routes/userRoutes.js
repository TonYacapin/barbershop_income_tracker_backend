const express = require('express');
const { registerUser, loginUser, getUserDetails } = require('../controllers/userControllers');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', registerUser); // Register a new user
router.post('/login', loginUser);       // Login a user

// Protected routes
router.get('/:id', authenticateToken, getUserDetails); // Get user details by ID

module.exports = router;