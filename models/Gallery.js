// ============================================================
// models/Gallery.js — Gallery Image Model
// ============================================================
const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Image title is required'],
    trim: true
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL/path is required']
  },
  category: {
    type: String,
    enum: ['Events', 'School', 'Activities', 'Sports', 'Celebrations'],
    default: 'School'
  },
  description: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Gallery', gallerySchema);
