const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const isAdmin = require('../middleware/isAdmin');

// Example admin-only route
router.get('/dashboard', isAdmin, adminController.dashboard);

module.exports = router;
