const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String },
  imageUrl: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  storeOwner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'StoreOwner', 
    required: true 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);