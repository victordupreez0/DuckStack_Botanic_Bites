// Middleware to check if user is admin
module.exports = (req, res, next) => {
  // Assuming user info is attached to req.user (from JWT/session)
  if (req.user && req.user.isAdmin) {
    return next();
  }
  return res.status(403).json({ message: 'Access denied: Admins only.' });
};
