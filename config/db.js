// ============================================================
// config/db.js — MongoDB Connection using Mongoose
// ============================================================
const mongoose = require('mongoose');

/**
 * Connect to MongoDB using the URI from environment variables.
 * Logs success or exits the process on failure.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Do not process.exit(1) here so Vercel Serverless Functions can log the error without hard-crashing.
  }
};

module.exports = connectDB;
