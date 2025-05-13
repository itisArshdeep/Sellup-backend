const mongoose = require('mongoose');

const StoreOwnerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  storeName: { type: String, required: true },
  storeSlug: { type: String, required: true, unique: true },
  upiId: { type: String, required: true },
  logo: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StoreOwner', StoreOwnerSchema);