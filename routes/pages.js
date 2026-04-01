// ============================================================
// routes/pages.js — Public Page Routes
// All GET routes for the public-facing pages of the website
// ============================================================
const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const Gallery = require('../models/Gallery');

// ---- HOME PAGE ----
router.get('/', async (req, res) => {
  try {
    // Fetch latest 5 notices and 6 gallery images in parallel
    const [notices, galleryImages] = await Promise.all([
      Notice.find().sort({ date: -1 }).limit(5),
      Gallery.find().sort({ date: -1 }).limit(6)
    ]);

    res.render('index', {
      title: 'Mother Teresa Public School - Home',
      page: 'home',
      notices,
      galleryImages
    });
  } catch (err) {
    console.error(err);
    res.render('index', {
      title: 'Mother Teresa Public School - Home',
      page: 'home',
      notices: [],
      galleryImages: []
    });
  }
});

// ---- ABOUT US ----
router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Us - Mother Teresa Public School',
    page: 'about'
  });
});

// ---- ADMISSIONS ----
router.get('/admissions', (req, res) => {
  const success = req.query.success;
  res.render('admissions', {
    title: 'Admissions - Mother Teresa Public School',
    page: 'admissions',
    success
  });
});

// ---- ACADEMICS ----
router.get('/academics', (req, res) => {
  res.render('academics', {
    title: 'Academics - Mother Teresa Public School',
    page: 'academics'
  });
});

// ---- FACULTIES ----
router.get('/faculties', (req, res) => {
  res.render('faculties', {
    title: 'Our Faculties - Mother Teresa Public School',
    page: 'faculties'
  });
});

// ---- FACILITIES ----
router.get('/facilities', (req, res) => {
  res.render('facilities', {
    title: 'Facilities - Mother Teresa Public School',
    page: 'facilities'
  });
});

// ---- GALLERY ----
router.get('/gallery', async (req, res) => {
  try {
    const category = req.query.category || 'All';
    let galleryImages;
    if (category === 'All') {
      galleryImages = await Gallery.find().sort({ date: -1 });
    } else {
      galleryImages = await Gallery.find({ category }).sort({ date: -1 });
    }
    res.render('gallery', {
      title: 'Gallery - Mother Teresa Public School',
      page: 'gallery',
      galleryImages,
      selectedCategory: category
    });
  } catch (err) {
    console.error(err);
    res.render('gallery', {
      title: 'Gallery - Mother Teresa Public School',
      page: 'gallery',
      galleryImages: [],
      selectedCategory: 'All'
    });
  }
});

// ---- NOTICE BOARD ----
router.get('/notices', async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 });
    res.render('notices', {
      title: 'Notice Board - Mother Teresa Public School',
      page: 'notices',
      notices
    });
  } catch (err) {
    console.error(err);
    res.render('notices', {
      title: 'Notice Board - Mother Teresa Public School',
      page: 'notices',
      notices: []
    });
  }
});

// ---- ALUMNI SECTION ----
router.get('/alumni', (req, res) => {
  res.render('alumni', {
    title: 'Alumni - Mother Teresa Public School',
    page: 'alumni'
  });
});

// ---- CONTACT ----
router.get('/contact', (req, res) => {
  const success = req.query.success;
  res.render('contact', {
    title: 'Contact Us - Mother Teresa Public School',
    page: 'contact',
    success
  });
});

module.exports = router;
