const { Income } = require('../models/income');

// Get income data grouped by source with optional date range filtering
const getIncomeBySource = async (req, res) => {
    try {
        // Log incoming request parameters for debugging
        console.log('getIncomeBySource query params:', req.query);
        const { startDate, endDate } = req.query;

        const matchStage = {};
        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) {
                // Ensure proper date handling by creating a new date and setting to start of day
                const parsedDate = new Date(startDate);
                matchStage.createdAt.$gte = parsedDate;
                console.log('Using start date:', parsedDate);
            }
            if (endDate) {
                // For end date, set to end of day to include the entire day
                const parsedDate = new Date(endDate);
                parsedDate.setHours(23, 59, 59, 999);
                matchStage.createdAt.$lte = parsedDate;
                console.log('Using end date:', parsedDate);
            }
        }

        console.log('Using match stage:', JSON.stringify(matchStage));

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

        console.log(`Found ${incomeData.length} income sources`);
        res.status(200).json({ incomeBySource: incomeData });
    } catch (error) {
        console.error('Error in getIncomeBySource:', error);
        res.status(500).json({ message: 'Error fetching income data by source', error: error.message });
    }
};

// Get income data grouped by date with optional granularity (day, month, year)
const getIncomeByDate = async (req, res) => {
    try {
        console.log('getIncomeByDate query params:', req.query);
        const { startDate, endDate, granularity = "day" } = req.query;

        const matchStage = {};
        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) {
                const parsedDate = new Date(startDate);
                matchStage.createdAt.$gte = parsedDate;
                console.log('Using start date:', parsedDate);
            }
            if (endDate) {
                const parsedDate = new Date(endDate);
                parsedDate.setHours(23, 59, 59, 999);
                matchStage.createdAt.$lte = parsedDate;
                console.log('Using end date:', parsedDate);
            }
        }

        const dateFormat =
            granularity === "month"
                ? "%Y-%m"
                : granularity === "year"
                ? "%Y"
                : "%Y-%m-%d"; // Default to day
                
        console.log('Using date format:', dateFormat);
        console.log('Using match stage:', JSON.stringify(matchStage));

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

        console.log(`Found ${incomeData.length} date entries`);
        res.status(200).json({ incomeByDate: incomeData });
    } catch (error) {
        console.error('Error in getIncomeByDate:', error);
        res.status(500).json({ message: 'Error fetching income data by date', error: error.message });
    }
};

// Get total income metrics
const getTotalIncome = async (req, res) => {
    try {
        console.log('getTotalIncome query params:', req.query);
        const { startDate, endDate } = req.query;

        const matchStage = {};
        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) {
                const parsedDate = new Date(startDate);
                matchStage.createdAt.$gte = parsedDate;
                console.log('Using start date:', parsedDate);
            }
            if (endDate) {
                const parsedDate = new Date(endDate);
                parsedDate.setHours(23, 59, 59, 999);
                matchStage.createdAt.$lte = parsedDate;
                console.log('Using end date:', parsedDate);
            }
        }

        console.log('Using match stage:', JSON.stringify(matchStage));

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

        const result = totalData[0] || { totalIncome: 0, totalHeads: 0, averageIncomePerHead: 0 };
        console.log('Total income result:', result);
        res.status(200).json({ totalIncome: result });
    } catch (error) {
        console.error('Error in getTotalIncome:', error);
        res.status(500).json({ message: 'Error fetching total income data', error: error.message });
    }
};

// Get income trends for a specific source over time
const getIncomeTrendsBySource = async (req, res) => {
    try {
        console.log('getIncomeTrendsBySource query params:', req.query);
        const { source, startDate, endDate, granularity = "day" } = req.query;

        if (!source) {
            console.log('Missing source parameter');
            return res.status(400).json({ message: 'Source is required for income trends' });
        }

        // Make source matching case-insensitive using regex
        const sourceRegex = new RegExp('^' + source + '$', 'i');
        const matchStage = { source: sourceRegex };
        
        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) {
                const parsedDate = new Date(startDate);
                matchStage.createdAt.$gte = parsedDate;
                console.log('Using start date:', parsedDate);
            }
            if (endDate) {
                const parsedDate = new Date(endDate);
                parsedDate.setHours(23, 59, 59, 999);
                matchStage.createdAt.$lte = parsedDate;
                console.log('Using end date:', parsedDate);
            }
        }

        const dateFormat =
            granularity === "month"
                ? "%Y-%m"
                : granularity === "year"
                ? "%Y"
                : "%Y-%m-%d"; // Default to day

        console.log('Using date format:', dateFormat);
        console.log('Using match stage:', JSON.stringify(matchStage));

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

        console.log(`Found ${incomeTrends.length} trend entries for source "${source}"`);
        res.status(200).json({ incomeTrends });
    } catch (error) {
        console.error('Error in getIncomeTrendsBySource:', error);
        res.status(500).json({ message: 'Error fetching income trends by source', error: error.message });
    }
};

module.exports = {
    getIncomeBySource,
    getIncomeByDate,
    getTotalIncome,
    getIncomeTrendsBySource,
};