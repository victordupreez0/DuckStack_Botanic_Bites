

const express = require('express');
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const multer = require('multer');
const path = require('path');

// Configure multer for up to 4 images
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '../../uploads/products'));
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname);
	}
});
const upload = multer({ storage: storage });

const router = express.Router();
// Increment stock for a product
router.patch('/:id/stock', auth, isAdmin, productController.incrementStock);

// Only admins can add or delete products
router.post('/', auth, isAdmin, upload.array('images', 4), productController.addProduct);
router.get('/', productController.getProducts);
router.delete('/:id', auth, isAdmin, productController.deleteProduct);
router.put('/:id', auth, isAdmin, upload.array('images', 4), productController.updateProduct);
// Stocktake endpoint for admins

module.exports = router;
