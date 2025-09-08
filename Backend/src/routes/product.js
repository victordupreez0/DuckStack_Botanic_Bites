
const express = require('express');
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const router = express.Router();
// multer for handling image uploads
const multer = require('multer');
const path = require('path');
const uploadDir = path.join(__dirname, '..', '..', 'uploads');
const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, uploadDir),
	filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`),
});
const upload = multer({ storage, limits: { files: 4 } });
// Increment stock for a product
router.patch('/:id/stock', auth, isAdmin, productController.incrementStock);

// Only admins can add or delete products
router.post('/', auth, isAdmin, upload.array('images', 4), productController.addProduct);
router.get('/', productController.getProducts);
router.delete('/:id', auth, isAdmin, productController.deleteProduct);
router.put('/:id', auth, isAdmin, upload.array('images', 4), productController.updateProduct);
// Accept PATCH as well for partial updates from frontend
router.patch('/:id', auth, isAdmin, upload.array('images', 4), productController.updateProduct);
// Stocktake endpoint for admins

module.exports = router;
