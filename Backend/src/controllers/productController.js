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
};
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
    console.log('Add Product Request Body:', req.body);
    const collection = await getCollection();
    const product = {
      name: req.body.name,
      species: req.body.species,
      price: Number(req.body.price),
      description: req.body.description,
      image: req.body.image,
      category: req.body.category,
      inStock: req.body.inStock !== undefined ? req.body.inStock : true
    };
    const result = await collection.insertOne(product);
    res.status(201).json({ _id: result.insertedId, ...product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const collection = await getCollection();
  const products = await collection.find({}).toArray();
  res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
