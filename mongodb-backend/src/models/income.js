const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    source: {
        type: String,
        required: true, // Name of the employee or admin
        trim: true,
    },
    numberOfHeads: {
        type: Number,
        required: true, // Number of haircuts performed
        min: 0,
    },
    income: {
        type: Number,
        required: true, // Profit gained by the employee or admin
        min: 0,
    },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const Income = mongoose.model('Income', incomeSchema);

module.exports = {
    Income,
};