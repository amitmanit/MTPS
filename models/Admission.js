// ============================================================
// models/Admission.js — Student Admission Form Model
// ============================================================
const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Gender is required']
  },
  classApplied: {
    type: String,
    required: [true, 'Class is required'],
    trim: true
  },
  fatherName: {
    type: String,
    required: [true, "Father's name is required"],
    trim: true
  },
  motherName: {
    type: String,
    required: [true, "Mother's name is required"],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  previousSchool: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  }
}, {
  timestamps: true  // Tracks when the form was submitted
});

module.exports = mongoose.model('Admission', admissionSchema);
