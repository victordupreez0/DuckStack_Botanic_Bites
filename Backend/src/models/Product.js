const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
  category: { type: String },
  inStock: { type: Boolean, default: true }
});

module.exports = mongoose.model('Product', productSchema);
