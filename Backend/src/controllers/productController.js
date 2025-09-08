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
    if (existingProduct) {
      // Update stock on product
      await collection.updateOne(
        { _id: new ObjectId(id) },
        { $inc: { stock: amount } }
      );
      const updatedProduct = await collection.findOne({ _id: new ObjectId(id) });
      return res.json(updatedProduct);
    }

    // If not found in products, attempt to update bundles collection so admins can add stock to bundles
    const { MongoClient } = require('mongodb');
    const uri = process.env.ACCESS_STRING;
    const DB_NAME = 'Botanic-DB';
    const BUNDLE_COLLECTION = 'bundles';
    let localClient;
    try {
      localClient = new MongoClient(uri, { useUnifiedTopology: true });
      await localClient.connect();
      const bundleColl = localClient.db(DB_NAME).collection(BUNDLE_COLLECTION);
      const existingBundle = await bundleColl.findOne({ _id: new ObjectId(id) });
      if (!existingBundle) {
        return res.status(404).json({ error: 'Product not found' });
      }
      await bundleColl.updateOne({ _id: new ObjectId(id) }, { $inc: { stock: amount } });
      const updatedBundle = await bundleColl.findOne({ _id: new ObjectId(id) });
      return res.json(updatedBundle);
    } finally {
      try { if (localClient) await localClient.close(); } catch (e) {}
    }
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
    console.log('Add Product Request Body:', req.body, 'files:', req.files && req.files.length);
    const collection = await getCollection();
    // Build images array: prefer uploaded files, otherwise accept image URLs in body (image or images[])
    let images = [];
    if (req.files && req.files.length) {
      const base = req.protocol + '://' + req.get('host');
      images = req.files.map(f => `${base}/uploads/${f.filename}`);
    } else if (req.body.images) {
      // Accept comma separated or array
      if (Array.isArray(req.body.images)) images = req.body.images.filter(Boolean);
      else images = String(req.body.images).split(',').map(s => s.trim()).filter(Boolean);
    } else if (req.body.image) {
      images = [req.body.image];
    }

    const product = {
      name: req.body.name,
      species: req.body.species,
      price: Number(req.body.price),
  specialPrice: req.body.specialPrice !== undefined && req.body.specialPrice !== '' ? Number(req.body.specialPrice) : undefined,
      description: req.body.description,
      images,
      category: req.body.category,
  stock: 0,
  // optional admin flags
  featured: req.body.featured === 'true' || req.body.featured === true || false,
  specialDeal: req.body.specialDeal === 'true' || req.body.specialDeal === true || false,
  hidden: req.body.hidden === 'true' || req.body.hidden === true || false
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
  // when not showing all, return only in-stock products that are not hidden
  const filter = showAll ? {} : { stock: { $gt: 0 }, hidden: { $ne: true } };
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
    // images: handle uploaded files or provided URLs
    if ((req.files && req.files.length) || req.body.images !== undefined || req.body.image !== undefined) {
      let images = [];
      if (req.files && req.files.length) {
        const base = req.protocol + '://' + req.get('host');
        images = req.files.map(f => `${base}/uploads/${f.filename}`);
      } else if (req.body.images) {
        if (Array.isArray(req.body.images)) images = req.body.images.filter(Boolean);
        else images = String(req.body.images).split(',').map(s => s.trim()).filter(Boolean);
      } else if (req.body.image) {
        images = [req.body.image];
      }
      update.images = images;
    }
    if (req.body.category !== undefined) update.category = req.body.category;
    if (req.body.stock !== undefined) update.stock = Number(req.body.stock);
  if (req.body.specialPrice !== undefined) update.specialPrice = req.body.specialPrice === '' ? null : Number(req.body.specialPrice);
    // allow updating admin flags
    if (req.body.featured !== undefined) update.featured = req.body.featured === 'true' || req.body.featured === true;
    if (req.body.specialDeal !== undefined) update.specialDeal = req.body.specialDeal === 'true' || req.body.specialDeal === true;
    if (req.body.hidden !== undefined) update.hidden = req.body.hidden === 'true' || req.body.hidden === true;
    console.log('UpdateProduct called with id:', id, 'update payload keys:', Object.keys(req.body));
    if (!ObjectId.isValid(id)) {
      console.warn('Invalid product id for update:', id);
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    const queryId = new ObjectId(id);
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
