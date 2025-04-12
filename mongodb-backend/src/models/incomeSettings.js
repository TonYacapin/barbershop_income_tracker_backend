const mongoose = require('mongoose');

const incomeSettingsSchema = new mongoose.Schema({
    haircutPrice: {
        type: Number,
        required: true, // Price for a single haircut
        min: 0,
    },
    ownerSharePercentage: {
        type: Number,
        required: true, // Owner's share of the profit in percentage
        min: 0,
        max: 100, // Ensure the percentage is between 0 and 100
    },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const IncomeSettings = mongoose.model('IncomeSettings', incomeSettingsSchema);

module.exports = {
    IncomeSettings,
};