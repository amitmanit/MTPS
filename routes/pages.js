// ============================================================
// routes/pages.js — Public Page Routes
// All GET routes for the public-facing pages of the website
// ============================================================
const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const Gallery = require('../models/Gallery');
const cache = require('../config/cache');

// Cache TTL constants (in seconds)
const TTL_HOME    = 300;  // 5 min  — home page notices + gallery preview
const TTL_NOTICES = 180;  // 3 min  — notice board (updated more often)
const TTL_GALLERY = 600;  // 10 min — gallery images (rarely change)

// ---- HOME PAGE ----
router.get('/', async (req, res) => {
  try {
    // Try to serve from cache first
    let notices = cache.get('home:notices');
    let galleryImages = cache.get('home:gallery');

    if (!notices || !galleryImages) {
      // Cache miss — fetch from DB in parallel
      [notices, galleryImages] = await Promise.all([
        Notice.find()
          .sort({ date: -1 })
          .limit(5)
          .select('title content important date')
          .lean(),
        Gallery.find()
          .sort({ date: -1 })
          .limit(6)
          .select('title imageUrl category')
          .lean()
      ]);
      cache.set('home:notices', notices, TTL_HOME);
      cache.set('home:gallery', galleryImages, TTL_HOME);
    }

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
    const cacheKey = `gallery:${category}`;

    let galleryImages = cache.get(cacheKey);
    if (!galleryImages) {
      // Cache miss — fetch from DB
      const filter = category === 'All' ? {} : { category };
      galleryImages = await Gallery.find(filter)
        .sort({ date: -1 })
        .select('title imageUrl category description')
        .lean();
      cache.set(cacheKey, galleryImages, TTL_GALLERY);
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
    let notices = cache.get('notices:all');
    if (!notices) {
      notices = await Notice.find()
        .sort({ date: -1 })
        .select('title content important date')
        .lean();
      cache.set('notices:all', notices, TTL_NOTICES);
    }
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
