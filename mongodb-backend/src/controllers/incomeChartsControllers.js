const { Income } = require('../models/income');

// Get income data grouped by source with optional date range filtering
const getIncomeBySource = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const matchStage = {};
        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) matchStage.createdAt.$gte = new Date(startDate);
            if (endDate) matchStage.createdAt.$lte = new Date(endDate);
        }

        const incomeData = await Income.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: { $toLower: "$source" }, // Convert source to lowercase for case-insensitive grouping
                    totalIncome: { $sum: "$income" },
                    totalHeads: { $sum: "$numberOfHeads" },
                    averageIncomePerHead: { $avg: { $divide: ["$income", "$numberOfHeads"] } },
                },
            },
            { $sort: { totalIncome: -1 } }, // Sort by total income descending
        ]);

        res.status(200).json({ incomeBySource: incomeData });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching income data by source', error: error.message });
    }
};
// Get income data grouped by date with optional granularity (day, month, year)
const getIncomeByDate = async (req, res) => {
    try {
        const { startDate, endDate, granularity = "day" } = req.query;

        const matchStage = {};
        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) matchStage.createdAt.$gte = new Date(startDate);
            if (endDate) matchStage.createdAt.$lte = new Date(endDate);
        }

        const dateFormat =
            granularity === "month"
                ? "%Y-%m"
                : granularity === "year"
                ? "%Y"
                : "%Y-%m-%d"; // Default to day

        const incomeData = await Income.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
                    totalIncome: { $sum: "$income" },
                    totalHeads: { $sum: "$numberOfHeads" },
                },
            },
            { $sort: { _id: 1 } }, // Sort by date ascending
        ]);

        res.status(200).json({ incomeByDate: incomeData });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching income data by date', error: error.message });
    }
};

// Get total income, total heads, and additional metrics with optional date range filtering
const getTotalIncome = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const matchStage = {};
        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) matchStage.createdAt.$gte = new Date(startDate);
            if (endDate) matchStage.createdAt.$lte = new Date(endDate);
        }

        const totalData = await Income.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: "$income" },
                    totalHeads: { $sum: "$numberOfHeads" },
                    averageIncomePerHead: { $avg: { $divide: ["$income", "$numberOfHeads"] } },
                },
            },
        ]);

        res.status(200).json({ totalIncome: totalData[0] || { totalIncome: 0, totalHeads: 0, averageIncomePerHead: 0 } });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching total income data', error: error.message });
    }
};

// Get income trends for a specific source over time
const getIncomeTrendsBySource = async (req, res) => {
    try {
        const { source, startDate, endDate, granularity = "day" } = req.query;

        if (!source) {
            return res.status(400).json({ message: 'Source is required for income trends' });
        }

        const matchStage = { source };
        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) matchStage.createdAt.$gte = new Date(startDate);
            if (endDate) matchStage.createdAt.$lte = new Date(endDate);
        }

        const dateFormat =
            granularity === "month"
                ? "%Y-%m"
                : granularity === "year"
                ? "%Y"
                : "%Y-%m-%d"; // Default to day

        const incomeTrends = await Income.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
                    totalIncome: { $sum: "$income" },
                    totalHeads: { $sum: "$numberOfHeads" },
                },
            },
            { $sort: { _id: 1 } }, // Sort by date ascending
        ]);

        res.status(200).json({ incomeTrends });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching income trends by source', error: error.message });
    }
};

module.exports = {
    getIncomeBySource,
    getIncomeByDate,
    getTotalIncome,
    getIncomeTrendsBySource,
};