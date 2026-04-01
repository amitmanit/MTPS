// ============================================================
// models/Notice.js — Notice / Announcement Model
// ============================================================
const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Notice title is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Notice content is required']
  },
  important: {
    type: Boolean,
    default: false  // Flag to highlight urgent notices
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Sort notices by date descending (newest first)
noticeSchema.index({ date: -1 });

module.exports = mongoose.model('Notice', noticeSchema);
