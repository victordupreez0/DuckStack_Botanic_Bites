// Increment stock for a product
exports.incrementStock = async (req, res) => {
  try {
    const collection = await getCollection();
    const id = req.params.id;
    const amount = Number(req.body.amount);
    console.log('PATCH /api/products/:id/stock called with id:', id);
    if (!amount || isNaN(amount) || amount < 1) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    // Check if product exists first
    const existingProduct = await collection.findOne({ _id: new ObjectId(id) });
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    // Update stock
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { stock: amount } }
    );
    // Return updated product
    const updatedProduct = await collection.findOne({ _id: new ObjectId(id) });
    res.json(updatedProduct);
  } catch (err) {
    console.error('incrementStock error:', err);
    res.status(500).json({ error: err.message });
  }
};
const { ObjectId } = require('mongodb');
exports.deleteProduct = async (req, res) => {
  try {
    const collection = await getCollection();
    const id = req.params.id;
    console.log('DELETE /api/products/:id called with id:', id);
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    console.log('Delete result:', result);
    if (result.deletedCount === 1) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: err.message });
  }
}
const { MongoClient } = require('mongodb');
const uri = process.env.ACCESS_STRING;
const DB_NAME = 'Botanic-DB';
const COLLECTION = 'products';

let client;
async function getCollection() {
  if (!client) {
    client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
  }
  return client.db(DB_NAME).collection(COLLECTION);
}

exports.addProduct = async (req, res) => {
  try {
    console.log('Add Product Request Body:', req.body, 'stock type:', typeof req.body.stock);
    const collection = await getCollection();
    // Handle up to 4 uploaded images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => '/uploads/products/' + file.filename);
    } else if (req.body.images) {
      // fallback for direct URLs
      images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }
    // Ensure 4 images (fill with empty string if less)
    while (images.length < 4) images.push('');
    const product = {
      name: req.body.name,
      species: req.body.species,
      price: Number(req.body.price),
      description: req.body.description,
      images,
      category: req.body.category,
      stock: 0
    };
    console.log('Parsed product for DB:', product, 'stock type:', typeof product.stock);
    const result = await collection.insertOne(product);
    res.status(201).json({ _id: result.insertedId, ...product });
  } catch (err) {
    console.error('Add product error:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const collection = await getCollection();
  // If ?showAll=true is provided, return all products (for admin UI)
  const showAll = String(req.query.showAll || '').toLowerCase() === 'true';
  const filter = showAll ? {} : { stock: { $gt: 0 } };
  const products = await collection.find(filter).toArray();
  res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: update stock for a product (increment by amount)
// Update product fields (including stock)
exports.updateProduct = async (req, res) => {
  try {
    const collection = await getCollection();
    const id = req.params.id;
    const update = {};
    // Only allow updating certain fields
    if (req.body.name !== undefined) update.name = req.body.name;
    if (req.body.species !== undefined) update.species = req.body.species;
    if (req.body.price !== undefined) update.price = Number(req.body.price);
    if (req.body.description !== undefined) update.description = req.body.description;
    if (req.body.category !== undefined) update.category = req.body.category;
    if (req.body.stock !== undefined) update.stock = Number(req.body.stock);
    // Handle images update
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => '/uploads/products/' + file.filename);
    } else if (req.body.images) {
      images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }
    if (images.length > 0) {
      while (images.length < 4) images.push('');
      update.images = images;
    }
    console.log('UpdateProduct called with id:', id);
    const queryId = ObjectId.isValid(id) ? new ObjectId(id) : id;
    const result = await collection.findOneAndUpdate(
      { _id: queryId },
      { $set: update },
      { returnDocument: 'after' }
    );
    console.log('UpdateProduct query result:', result);
    if (!result.value) return res.status(404).json({ error: 'Product not found' });
    res.json(result.value);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
