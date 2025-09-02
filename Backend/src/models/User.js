const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  surname: { type: String },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  reseller: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);
