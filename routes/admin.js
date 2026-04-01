// ============================================================
// routes/admin.js — Admin Dashboard Routes
// All routes behind isLoggedIn middleware (except login)
// ============================================================
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Admin = require('../models/Admin');
const Notice = require('../models/Notice');
const Gallery = require('../models/Gallery');
const Admission = require('../models/Admission');
const Contact = require('../models/Contact');
const { isLoggedIn } = require('../middleware/auth');
const cache = require('../config/cache');

// ---- Multer Config for Gallery Uploads ----
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'images', 'uploads'));
  },
  filename: (req, file, cb) => {
    // Create unique filename: timestamp-originalname
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Allow only image files
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed.'));
    }
  }
});

// ============================================================
// AUTH ROUTES
// ============================================================

// ---- Login Page ----
router.get('/login', (req, res) => {
  if (req.session && req.session.adminId) {
    return res.redirect('/admin/dashboard');
  }
  const errorMsg = req.session.errorMsg || null;
  req.session.errorMsg = null;
  res.render('admin/login', {
    title: 'Admin Login',
    page: 'admin',
    errorMsg
  });
});

// ---- Login POST ----
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username: username.toLowerCase() });

    if (!admin) {
      req.session.errorMsg = 'Invalid username or password.';
      return res.redirect('/admin/login');
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      req.session.errorMsg = 'Invalid username or password.';
      return res.redirect('/admin/login');
    }

    // Store admin session
    req.session.adminId = admin._id;
    req.session.adminUsername = admin.username;
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Login Error:', err);
    req.session.errorMsg = 'An error occurred. Please try again.';
    res.redirect('/admin/login');
  }
});

// ---- Logout ----
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error('Logout Error:', err);
    res.redirect('/admin/login');
  });
});

// ============================================================
// DASHBOARD
// ============================================================
router.get('/dashboard', isLoggedIn, async (req, res) => {
  try {
    const noticeCount = await Notice.countDocuments();
    const galleryCount = await Gallery.countDocuments();
    const admissionCount = await Admission.countDocuments();
    const contactCount = await Contact.countDocuments({ read: false });
    const recentAdmissions = await Admission.find().sort({ createdAt: -1 }).limit(5);
    const recentNotices = await Notice.find().sort({ date: -1 }).limit(5);

    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      page: 'admin',
      adminUsername: req.session.adminUsername,
      stats: { noticeCount, galleryCount, admissionCount, contactCount },
      recentAdmissions,
      recentNotices
    });
  } catch (err) {
    console.error(err);
    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      page: 'admin',
      adminUsername: req.session.adminUsername,
      stats: { noticeCount: 0, galleryCount: 0, admissionCount: 0, contactCount: 0 },
      recentAdmissions: [],
      recentNotices: []
    });
  }
});

// ============================================================
// NOTICE MANAGEMENT
// ============================================================

// List all notices
router.get('/notices', isLoggedIn, async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 });
    res.render('admin/notices', {
      title: 'Manage Notices',
      page: 'admin',
      adminUsername: req.session.adminUsername,
      notices,
      editNotice: null
    });
  } catch (err) {
    console.error(err);
    res.redirect('/admin/dashboard');
  }
});

// Add new notice
router.post('/notices', isLoggedIn, async (req, res) => {
  try {
    const { title, content, important } = req.body;
    await Notice.create({
      title,
      content,
      important: important === 'on'
    });
    // Invalidate notice cache so new data is visible immediately
    cache.del('notices:all');
    cache.del('home:notices');
    res.redirect('/admin/notices');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/notices');
  }
});

// Edit notice — show form with data
router.get('/notices/edit/:id', isLoggedIn, async (req, res) => {
  try {
    const editNotice = await Notice.findById(req.params.id);
    const notices = await Notice.find().sort({ date: -1 });
    res.render('admin/notices', {
      title: 'Edit Notice',
      page: 'admin',
      adminUsername: req.session.adminUsername,
      notices,
      editNotice
    });
  } catch (err) {
    console.error(err);
    res.redirect('/admin/notices');
  }
});

// Update notice
router.post('/notices/edit/:id', isLoggedIn, async (req, res) => {
  try {
    const { title, content, important } = req.body;
    await Notice.findByIdAndUpdate(req.params.id, {
      title,
      content,
      important: important === 'on'
    });
    cache.del('notices:all');
    cache.del('home:notices');
    res.redirect('/admin/notices');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/notices');
  }
});

// Delete notice
router.get('/notices/delete/:id', isLoggedIn, async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    cache.del('notices:all');
    cache.del('home:notices');
    res.redirect('/admin/notices');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/notices');
  }
});

// ============================================================
// GALLERY MANAGEMENT
// ============================================================

// List all gallery images
router.get('/gallery', isLoggedIn, async (req, res) => {
  try {
    const images = await Gallery.find().sort({ date: -1 });
    res.render('admin/gallery', {
      title: 'Manage Gallery',
      page: 'admin',
      adminUsername: req.session.adminUsername,
      images
    });
  } catch (err) {
    console.error(err);
    res.redirect('/admin/dashboard');
  }
});

// Upload new image
router.post('/gallery', isLoggedIn, upload.single('image'), async (req, res) => {
  try {
    const { title, category, description } = req.body;
    let imageUrl = '';

    if (req.file) {
      imageUrl = '/images/uploads/' + req.file.filename;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

    await Gallery.create({ title, imageUrl, category, description });
    // Invalidate gallery cache so new image appears immediately
    cache.del('gallery:All');
    cache.del(`gallery:${category}`);
    cache.del('home:gallery');
    res.redirect('/admin/gallery');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/gallery');
  }
});

// Delete gallery image
router.get('/gallery/delete/:id', isLoggedIn, async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    cache.flush(); // flush all gallery cache keys
    res.redirect('/admin/gallery');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/gallery');
  }
});

// ============================================================
// ADMISSIONS MANAGEMENT
// ============================================================

// List all admissions
router.get('/admissions', isLoggedIn, async (req, res) => {
  try {
    const statusFilter = req.query.status || 'All';
    let admissions;
    if (statusFilter === 'All') {
      admissions = await Admission.find().sort({ createdAt: -1 });
    } else {
      admissions = await Admission.find({ status: statusFilter }).sort({ createdAt: -1 });
    }
    res.render('admin/admissions', {
      title: 'Manage Admissions',
      page: 'admin',
      adminUsername: req.session.adminUsername,
      admissions,
      statusFilter
    });
  } catch (err) {
    console.error(err);
    res.redirect('/admin/dashboard');
  }
});

// Update admission status
router.post('/admissions/:id/status', isLoggedIn, async (req, res) => {
  try {
    const { status } = req.body;
    await Admission.findByIdAndUpdate(req.params.id, { status });
    res.redirect('/admin/admissions');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/admissions');
  }
});

// Delete admission
router.get('/admissions/delete/:id', isLoggedIn, async (req, res) => {
  try {
    await Admission.findByIdAndDelete(req.params.id);
    res.redirect('/admin/admissions');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/admissions');
  }
});

// ============================================================
// CONTACT MESSAGES
// ============================================================
router.get('/messages', isLoggedIn, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ date: -1 });
    res.render('admin/messages', {
      title: 'Contact Messages',
      page: 'admin',
      adminUsername: req.session.adminUsername,
      messages
    });
  } catch (err) {
    console.error(err);
    res.redirect('/admin/dashboard');
  }
});

// Mark message as read
router.get('/messages/read/:id', isLoggedIn, async (req, res) => {
  try {
    await Contact.findByIdAndUpdate(req.params.id, { read: true });
    res.redirect('/admin/messages');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/messages');
  }
});

// Delete message
router.get('/messages/delete/:id', isLoggedIn, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.redirect('/admin/messages');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/messages');
  }
});

module.exports = router;
