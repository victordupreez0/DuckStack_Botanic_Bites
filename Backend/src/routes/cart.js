const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth');

// All cart routes require authentication
router.use(auth);

// Get current user's cart
router.get('/', cartController.getCart);

// Add or update item in cart (body: { productId, quantity })
router.post('/item', cartController.addOrUpdateItem);

// Update item quantity (alias) - accepts body { quantity }
router.patch('/item/:productId', cartController.addOrUpdateItem);

// Remove item
router.delete('/item/:productId', cartController.removeItem);

// Clear cart
router.post('/clear', cartController.clearCart);

// Checkout - compute total
router.get('/checkout', cartController.checkout);

module.exports = router;
