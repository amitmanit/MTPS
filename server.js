// ============================================================
// server.js — Main Application Entry Point
// Mother Teresa Public School Website
// ============================================================
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const connectDB = require('./config/db');

// Import route files
const pageRoutes = require('./routes/pages');
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ---- Connect to MongoDB ----
connectDB();

// ---- Middleware ----

// Parse URL-encoded form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ---- Session Configuration ----
app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultSecret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    httpOnly: true               // Prevents client-side JS access
  }
}));

// ---- Routes ----
app.use('/', pageRoutes);        // Public pages
app.use('/api', apiRoutes);      // Form submissions
app.use('/admin', adminRoutes);  // Admin dashboard

// ---- 404 Handler ----
app.use((req, res) => {
  res.status(404).render('404', {
    title: '404 - Page Not Found',
    page: '404'
  });
});

// ---- Error Handler ----
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).send('Something went wrong! Please try again later.');
});

// ---- Start Server ----
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════════╗
  ║   Mother Teresa Public School Website          ║
  ║   Server running on http://localhost:${PORT}      ║
  ╚════════════════════════════════════════════════╝
  `);
});

module.exports = app;
