const express = require('express');
const router = express.Router();
const bundlesController = require('../controllers/bundlesController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const multer = require('multer');
const path = require('path');
const uploadDir = path.join(__dirname, '..', '..', 'uploads');
const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, uploadDir),
	filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`),
});
const upload = multer({ storage, limits: { files: 6 } });

// Create a bundle (admin only) - accept images via multipart
router.post('/', auth, isAdmin, upload.array('images', 6), bundlesController.createBundle);
// Update bundle (admin only)
router.patch('/:id', auth, isAdmin, upload.array('images', 6), bundlesController.updateBundle);
// List bundles (public)
router.get('/', bundlesController.getBundles);

module.exports = router;
