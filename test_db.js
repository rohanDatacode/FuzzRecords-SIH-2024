const mongoose = require('mongoose');
require('dotenv').config();

const dbURL = process.env.MONGO_URL;

console.log("Testing Connection to:", dbURL.split('@')[1]); // Log only the host part for privacy

mongoose.connect(dbURL, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log('✅ Connected to MongoDB Successfully!');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Connection Failed:', err.message);
        process.exit(1);
    });
