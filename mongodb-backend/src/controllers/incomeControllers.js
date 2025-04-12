const { Income } = require('../models/income');
const { IncomeSettings } = require('../models/incomeSettings'); // Import IncomeSettings model

// Create a new income record
const createIncome = async (req, res) => {
    try {
        const { source, numberOfHeads, isOwner } = req.body;

        // Fetch the haircut price and owner's share percentage from IncomeSettings
        const settings = await IncomeSettings.findOne();
        if (!settings) {
            return res.status(400).json({ message: 'Income settings not configured' });
        }

        const haircutPrice = settings.haircutPrice;
        const ownerSharePercentage = settings.ownerSharePercentage;

        let income;

        if (isOwner) {
            // If owner, they keep 100% of the income
            income = numberOfHeads * haircutPrice;
        } else {
            // If not owner, they only get a percentage (e.g., 60%) of the total
            income = numberOfHeads * haircutPrice * (ownerSharePercentage / 100);
        }

        // Create a new income record
        const newIncome = new Income({
            source,
            numberOfHeads,
            income,
        });

        await newIncome.save();
        res.status(201).json({ message: 'Income record created successfully', income: newIncome });
    } catch (error) {
        res.status(500).json({ message: 'Error creating income record', error: error.message });
    }
};
// Update an income record by ID
const updateIncome = async (req, res) => {
    try {
        const { id } = req.params;
        const { source, numberOfHeads, isOwner } = req.body;

        // Fetch settings
        const settings = await IncomeSettings.findOne();
        if (!settings) {
            return res.status(400).json({ message: 'Income settings not configured' });
        }

        const haircutPrice = settings.haircutPrice;
        const ownerSharePercentage = settings.ownerSharePercentage;

        // Compute income based on ownership
        let income;
        if (isOwner) {
            income = numberOfHeads * haircutPrice;
        } else {
            income = numberOfHeads * haircutPrice * (ownerSharePercentage / 100);
        }

        const updatedIncome = await Income.findByIdAndUpdate(
            id,
            { source, numberOfHeads, income },
            { new: true, runValidators: true }
        );

        if (!updatedIncome) {
            return res.status(404).json({ message: 'Income record not found' });
        }

        res.status(200).json({ message: 'Income record updated successfully', income: updatedIncome });
    } catch (error) {
        res.status(500).json({ message: 'Error updating income record', error: error.message });
    }
};

// Other methods remain unchanged
const getAllIncome = async (req, res) => {
    try {
        const incomes = await Income.find();
        res.status(200).json({ incomes });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching income records', error: error.message });
    }
};

const getIncomeById = async (req, res) => {
    try {
        const { id } = req.params;

        const income = await Income.findById(id);
        if (!income) {
            return res.status(404).json({ message: 'Income record not found' });
        }

        res.status(200).json({ income });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching income record', error: error.message });
    }
};

const deleteIncome = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedIncome = await Income.findByIdAndDelete(id);
        if (!deletedIncome) {
            return res.status(404).json({ message: 'Income record not found' });
        }

        res.status(200).json({ message: 'Income record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting income record', error: error.message });
    }
};

module.exports = {
    createIncome,
    getAllIncome,
    getIncomeById,
    updateIncome,
    deleteIncome,
};