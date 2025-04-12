const { IncomeSettings } = require('../models/incomeSettings');

// Create or update income settings
const setIncomeSettings = async (req, res) => {
    try {
        const { haircutPrice, ownerSharePercentage } = req.body;

        // Check if settings already exist
        let settings = await IncomeSettings.findOne();
        if (settings) {
            // Update existing settings
            settings.haircutPrice = haircutPrice;
            settings.ownerSharePercentage = ownerSharePercentage;
            await settings.save();
            return res.status(200).json({ message: 'Income settings updated successfully', settings });
        }

        // Create new settings
        settings = new IncomeSettings({
            haircutPrice,
            ownerSharePercentage,
        });
        await settings.save();
        res.status(201).json({ message: 'Income settings created successfully', settings });
    } catch (error) {
        res.status(500).json({ message: 'Error setting income settings', error: error.message });
    }
};

// Get income settings
const getIncomeSettings = async (req, res) => {
    try {
        const settings = await IncomeSettings.findOne();
        if (!settings) {
            return res.status(404).json({ message: 'Income settings not found' });
        }
        res.status(200).json({ settings });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching income settings', error: error.message });
    }
};

module.exports = {
    setIncomeSettings,
    getIncomeSettings,
};