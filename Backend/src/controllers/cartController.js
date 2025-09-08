const { getCartCollection } = require('../models/Cart');
const { MongoClient, ObjectId } = require('mongodb');
const uri = process.env.ACCESS_STRING;
const DB_NAME = 'Botanic-DB';

// Helper to get products collection (reuse productController pattern)
let clientForProducts;
async function getProductsCollection() {
  if (!clientForProducts) {
    clientForProducts = new MongoClient(uri, { useUnifiedTopology: true });
    await clientForProducts.connect();
  }
  return clientForProducts.db(DB_NAME).collection('products');
}

let clientForBundles;
async function getBundlesCollection() {
  if (!clientForBundles) {
    clientForBundles = new MongoClient(uri, { useUnifiedTopology: true });
    await clientForBundles.connect();
  }
  return clientForBundles.db(DB_NAME).collection('bundles');
}

// Return the user's cart document; create if missing
exports.getCart = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const carts = await getCartCollection();
    let cart = await carts.findOne({ userId: typeof userId === 'string' ? userId : userId.toString() });
    if (!cart) {
      cart = { userId: typeof userId === 'string' ? userId : userId.toString(), items: [] };
      const r = await carts.insertOne(cart);
      cart._id = r.insertedId;
    }
    res.json(cart);
  } catch (err) {
    console.error('getCart error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Add or update an item (upsert by productId). Body: { productId, quantity }
exports.addOrUpdateItem = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const { productId } = req.body;
    // quantity is optional when increment is used
    let quantity = req.body.quantity;
    const increment = !!req.body.increment;
    if (!productId) return res.status(400).json({ error: 'Invalid payload: productId required' });
    if (quantity !== undefined) {
      quantity = Number(quantity);
      if (isNaN(quantity) || quantity < 0) return res.status(400).json({ error: 'Invalid payload: quantity' });
      quantity = Math.floor(quantity);
    }
    const carts = await getCartCollection();
    const queryUserId = typeof userId === 'string' ? userId : userId.toString();

    // Ensure product exists and has price
    const products = await getProductsCollection();
    const bundles = await getBundlesCollection();
    const lookupId = ObjectId.isValid(productId) ? new ObjectId(productId) : productId;
    let prod = await products.findOne({ _id: lookupId });
    let isBundle = false;
    if (!prod) {
      // try bundles
      const bundle = await bundles.findOne({ _id: lookupId });
      if (!bundle) return res.status(404).json({ error: 'Product not found' });
      prod = bundle;
      isBundle = true;
    }


    // If quantity === 0 then remove item
    if (quantity === 0 && !increment) {
      await carts.updateOne({ userId: queryUserId }, { $pull: { items: { productId } } });
      const updated = await carts.findOne({ userId: queryUserId });
      return res.json(updated || { userId: queryUserId, items: [] });
    }

    // Ensure cart exists
    await carts.updateOne({ userId: queryUserId }, { $setOnInsert: { userId: queryUserId, items: [] } }, { upsert: true });

    const itemProductId = typeof productId === 'string' ? productId : productId.toString();

    if (increment) {
      // Increment existing quantity by provided quantity (default 1)
      const incBy = (quantity === undefined) ? 1 : Math.max(0, Math.floor(quantity));
      // Try to update existing item
      const updateResult = await carts.updateOne(
        { userId: queryUserId, 'items.productId': itemProductId },
        { $inc: { 'items.$.quantity': incBy } }
      );
      if (updateResult.matchedCount === 0) {
        // Item not present: push new with quantity = incBy
        await carts.updateOne(
          { userId: queryUserId },
          { $push: { items: { productId: itemProductId, quantity: incBy } } }
        );
      }
    } else {
      // Set absolute quantity (replace or push)
      const setQty = Math.max(0, Math.floor(quantity || 0));
      const result = await carts.updateOne(
        { userId: queryUserId, 'items.productId': itemProductId },
        { $set: { 'items.$.quantity': setQty } }
      );
      if (result.matchedCount === 0) {
        await carts.updateOne(
          { userId: queryUserId },
          { $push: { items: { productId: itemProductId, quantity: setQty } } }
        );
      }
    }

    const updated = await carts.findOne({ userId: queryUserId });
    res.json(updated);
  } catch (err) {
    console.error('addOrUpdateItem error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Remove an item by productId (param)
exports.removeItem = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const productId = req.params.productId;
    if (!productId) return res.status(400).json({ error: 'productId required' });
    const carts = await getCartCollection();
    const queryUserId = typeof userId === 'string' ? userId : userId.toString();
    await carts.updateOne({ userId: queryUserId }, { $pull: { items: { productId } } });
    const updated = await carts.findOne({ userId: queryUserId });
    res.json(updated || { userId: queryUserId, items: [] });
  } catch (err) {
    console.error('removeItem error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const carts = await getCartCollection();
    const queryUserId = typeof userId === 'string' ? userId : userId.toString();
    await carts.updateOne({ userId: queryUserId }, { $set: { items: [] } }, { upsert: true });
    const updated = await carts.findOne({ userId: queryUserId });
    res.json(updated || { userId: queryUserId, items: [] });
  } catch (err) {
    console.error('clearCart error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Checkout: calculate total price (with current product prices) and return line items
exports.checkout = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const carts = await getCartCollection();
    const queryUserId = typeof userId === 'string' ? userId : userId.toString();
    const cart = await carts.findOne({ userId: queryUserId }) || { items: [] };

    const products = await getProductsCollection();
    const bundles = await getBundlesCollection();

    // Build line items with up-to-date price & image & name
    const productIds = cart.items.map(i => i.productId);
    // Convert productIds to ObjectId when valid
    const productQueries = productIds.map(id => (ObjectId.isValid(id) ? new ObjectId(id) : id));

    // Fetch products and bundles that match
    const prods = await products.find({ _id: { $in: productQueries } }).toArray();
    const bnds = await bundles.find({ _id: { $in: productQueries } }).toArray();

    const prodById = {};
    prods.forEach(p => { prodById[p._id.toString()] = { ...p, __type: 'product' }; });
    bnds.forEach(b => { prodById[b._id.toString()] = { ...b, __type: 'bundle' }; });

    // For bundles, we want to expand the bundle items with product names.
    // Collect inner product ids from all bundles in the cart so we can fetch them in one query.
    const innerIds = [];
    bnds.forEach(b => {
      if (Array.isArray(b.items)) {
        b.items.forEach(it => {
          const id = it.productId || it._id || it.id;
          if (id) innerIds.push(id);
        });
      }
    });
    // Normalize and dedupe inner ids
    const innerQueries = Array.from(new Set(innerIds.map(i => (ObjectId.isValid(i) ? new ObjectId(i) : i))));
    let innerProds = [];
    if (innerQueries.length) {
      innerProds = await products.find({ _id: { $in: innerQueries } }).toArray();
      innerProds.forEach(p => { prodById[p._id.toString()] = { ...p, __type: 'product' }; });
    }

    const lineItems = cart.items.map(item => {
      const p = prodById[item.productId];
      if (!p) return null;
      const isBundle = p.__type === 'bundle';
      // Use specialPrice when available for both products and bundles
      const unitPrice = (p.specialPrice !== undefined && p.specialPrice !== null) ? Number(p.specialPrice) : (Number(p.price) || 0);
      return {
        productId: item.productId,
        name: p.title || p.name,
        unitPrice,
        quantity: item.quantity,
        image: Array.isArray(p.images) && p.images.length ? p.images[0] : null,
        subtotal: unitPrice * item.quantity,
        isBundle: isBundle,
        bundleItems: isBundle ? (Array.isArray(p.items) ? p.items.map(it => {
          const id = it.productId || it._id || it.id;
          const idStr = id && ObjectId.isValid(id) ? (new ObjectId(id)).toString() : String(id);
          const prod = prodById[idStr];
          return {
            productId: id,
            qty: it.qty || it.quantity || 1,
            name: prod ? (prod.name || prod.title) : String(id)
          };
        }) : []) : undefined
      };
    }).filter(Boolean);

    const total = lineItems.reduce((s, li) => s + li.subtotal, 0);
    res.json({ lineItems, total });
  } catch (err) {
    console.error('checkout error:', err);
    res.status(500).json({ error: err.message });
  }
};
