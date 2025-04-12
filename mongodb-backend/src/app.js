const express = require('express');
const mongoose = require('mongoose');
const databaseConfig = require('./config/database');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Database connection
mongoose.connect(databaseConfig.uri, databaseConfig.options)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// Routes
app.use('/api', routes());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});