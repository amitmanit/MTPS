// ============================================================
// config/db.js — MongoDB Connection using Mongoose
// ============================================================
const mongoose = require('mongoose');

// Global connection variable for Vercel Serverless cache
let isConnected;

/**
 * Connect to MongoDB using the URI from environment variables.
 * Caches the connection for Serverless environments (like Vercel).
 */
const connectDB = async () => {
  if (isConnected) {
    console.log('✅ Reusing existing MongoDB connection');
    return mongoose.connection.getClient();
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    isConnected = conn.connections[0].readyState;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn.connection.getClient();
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Do not process.exit(1) here so Vercel Serverless Functions can log the error without hard-crashing.
    throw error;
  }
};

module.exports = connectDB;
