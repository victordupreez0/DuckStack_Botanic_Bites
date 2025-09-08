const { MongoClient, ObjectId } = require('mongodb');
const uri = process.env.ACCESS_STRING;
const DB_NAME = 'Botanic-DB';
const COLLECTION = 'bundles';

let client;
async function getCollection() {
  if (!client) {
    client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
  }
  return client.db(DB_NAME).collection(COLLECTION);
}

exports.createBundle = async (req, res) => {
  try {
    // Accept multipart/form-data or JSON body
    const body = req.body || {};
    const title = body.title || body.name || '';
    const description = body.description || '';
  const price = body.price;
  const specialPrice = body.specialPrice !== undefined ? body.specialPrice : undefined;
  const specialDeal = body.specialDeal !== undefined ? body.specialDeal : false;
    let items = body.items || [];

    // items might be a JSON string when sent via form-data
    if (typeof items === 'string' && items.trim()) {
      try { items = JSON.parse(items); } catch (e) { items = []; }
    }

    if (!title || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Bundle must include a title and at least one item' });
    }

    // Handle images from uploaded files or provided URLs
    let images = [];
    if (req.files && req.files.length) {
      const base = req.protocol + '://' + req.get('host');
      images = req.files.map(f => `${base}/uploads/${f.filename}`);
    } else if (body.images) {
      if (Array.isArray(body.images)) images = body.images.filter(Boolean);
      else images = String(body.images).split(',').map(s => s.trim()).filter(Boolean);
    } else if (body.image) {
      images = [body.image];
    }

    // normalize items
    const normalized = items.map(it => {
      const pid = it.productId || it.product || it.id;
      return {
        productId: ObjectId.isValid(pid) ? new ObjectId(pid) : pid,
        qty: Number(it.qty) || 1
      };
    });

    const collection = await getCollection();
    const stock = body.stock !== undefined ? Number(body.stock) : 0;
    const doc = {
      title: String(title),
      description: description ? String(description) : '',
      price: typeof price === 'number' ? price : (price ? Number(price) : 0),
      specialPrice: specialPrice !== undefined && specialPrice !== '' ? Number(specialPrice) : undefined,
      specialDeal: specialDeal === true || specialDeal === 'true' || specialDeal === 1 || specialDeal === '1' || false,
      stock,
      items: normalized,
      images,
      createdAt: new Date()
    };
    const result = await collection.insertOne(doc);
    res.status(201).json({ _id: result.insertedId, ...doc });
  } catch (err) {
    console.error('createBundle error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateBundle = async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid bundle id' });
    const body = req.body || {};
    const update = {};
  if (body.title !== undefined) update.title = body.title;
    if (body.name !== undefined && !update.title) update.title = body.name;
    if (body.description !== undefined) update.description = body.description;
    if (body.price !== undefined) update.price = Number(body.price);
  if (body.specialPrice !== undefined) update.specialPrice = body.specialPrice === '' ? null : Number(body.specialPrice);
  if (body.specialDeal !== undefined) update.specialDeal = (body.specialDeal === true || body.specialDeal === 'true' || body.specialDeal === '1' || body.specialDeal === 1);

    // items may be provided as JSON string or array
    let items = body.items;
    if (typeof items === 'string' && items.trim()) {
      try { items = JSON.parse(items); } catch (e) { items = undefined; }
    }
    if (Array.isArray(items)) {
      update.items = items.map(it => {
        const pid = it.productId || it.product || it.id;
        return { productId: ObjectId.isValid(pid) ? new ObjectId(pid) : pid, qty: Number(it.qty) || 1 };
      });
    }

  if (body.stock !== undefined) update.stock = Number(body.stock);

    // images: handle uploaded files or provided URLs
    if ((req.files && req.files.length) || body.images !== undefined || body.image !== undefined) {
      let images = [];
      if (req.files && req.files.length) {
        const base = req.protocol + '://' + req.get('host');
        images = req.files.map(f => `${base}/uploads/${f.filename}`);
      } else if (body.images) {
        if (Array.isArray(body.images)) images = body.images.filter(Boolean);
        else images = String(body.images).split(',').map(s => s.trim()).filter(Boolean);
      } else if (body.image) {
        images = [body.image];
      }
      update.images = images;
    }

    const collection = await getCollection();
    const result = await collection.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: update }, { returnDocument: 'after' });
    if (!result.value) return res.status(404).json({ error: 'Bundle not found' });
    res.json(result.value);
  } catch (err) {
    console.error('updateBundle error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getBundles = async (req, res) => {
  try {
    const collection = await getCollection();
    const bundles = await collection.find({}).toArray();
    res.json(bundles);
  } catch (err) {
    console.error('getBundles error:', err);
    res.status(500).json({ error: err.message });
  }
};
