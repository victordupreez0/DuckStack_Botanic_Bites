const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const isAdmin = require('../middleware/isAdmin');

// Example admin-only route
router.get('/dashboard', isAdmin, adminController.dashboard);
// Return list of users to admin UI
router.get('/users', isAdmin, adminController.getUsers);

module.exports = router;
