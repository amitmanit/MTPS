// ============================================================
// middleware/auth.js — Authentication Middleware
// ============================================================

/**
 * Middleware to check if an admin user is logged in.
 * Redirects to the login page if not authenticated.
 */
const isLoggedIn = (req, res, next) => {
  if (req.session && req.session.adminId) {
    return next();
  }
  req.session.errorMsg = 'Please log in to access the admin panel.';
  return res.redirect('/admin/login');
};

module.exports = { isLoggedIn };
