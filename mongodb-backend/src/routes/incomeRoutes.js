const express = require('express');
const {
    createIncome,
    getAllIncome,
    getIncomeById,
    updateIncome,
    deleteIncome,
} = require('../controllers/incomeControllers');
const { authenticateToken } = require('../middleware/authMiddleware'); // Optional: Protect routes

const router = express.Router();

// Public or protected routes (use `authenticateToken` if needed)
router.post('/', authenticateToken, createIncome); // Create a new income record
router.get('/', authenticateToken, getAllIncome); // Get all income records
router.get('/:id', authenticateToken, getIncomeById); // Get a single income record by ID
router.put('/:id', authenticateToken, updateIncome); // Update an income record by ID
router.delete('/:id', authenticateToken, deleteIncome); // Delete an income record by ID

module.exports = router;