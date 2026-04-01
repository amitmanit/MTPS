// ============================================================
// routes/api.js — Public API Routes (Form Submissions)
// Handles admission and contact form submissions
// ============================================================
const express = require('express');
const router = express.Router();
const Admission = require('../models/Admission');
const Contact = require('../models/Contact');

// ---- ADMISSION FORM SUBMISSION ----
router.post('/admission', async (req, res) => {
  try {
    const {
      studentName, dateOfBirth, gender, classApplied,
      fatherName, motherName, phone, email, address, previousSchool
    } = req.body;

    // Basic server-side validation
    if (!studentName || !dateOfBirth || !gender || !classApplied ||
        !fatherName || !motherName || !phone || !address) {
      return res.redirect('/admissions?success=false&msg=missing');
    }

    // Create new admission document
    const admission = new Admission({
      studentName, dateOfBirth, gender, classApplied,
      fatherName, motherName, phone, email, address, previousSchool
    });

    await admission.save();
    res.redirect('/admissions?success=true');
  } catch (err) {
    console.error('Admission Error:', err);
    res.redirect('/admissions?success=false');
  }
});

// ---- CONTACT FORM SUBMISSION ----
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Basic server-side validation
    if (!name || !email || !subject || !message) {
      return res.redirect('/contact?success=false&msg=missing');
    }

    // Create new contact document
    const contact = new Contact({ name, email, subject, message });
    await contact.save();
    res.redirect('/contact?success=true');
  } catch (err) {
    console.error('Contact Error:', err);
    res.redirect('/contact?success=false');
  }
});

module.exports = router;
