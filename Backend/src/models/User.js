// Plain MongoDB helper for user collection
const { MongoClient } = require('mongodb');
const uri = process.env.ACCESS_STRING;
const DB_NAME = 'Botanic-DB';
const COLLECTION = 'users';
let client;
async function getUserCollection() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db(DB_NAME).collection(COLLECTION);
}
module.exports = { getUserCollection };
