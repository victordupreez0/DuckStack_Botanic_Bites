const { MongoClient } = require('mongodb');
const uri = process.env.ACCESS_STRING;
const DB_NAME = 'Botanic-DB';
const COLLECTION = 'carts';
let client;

async function getCartCollection() {
  if (!client) {
    client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
  }
  return client.db(DB_NAME).collection(COLLECTION);
}

module.exports = { getCartCollection };
