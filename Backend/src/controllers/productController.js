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
    console.log('Products from DB:', products);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
