const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  quantity: { type: Number, required: true },
  priceAtOrder: { type: Number, required: true }
});

const OrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerAddress: { type: String, required: true },
  customerPhone: { type: String, required: true },
  items: [OrderItemSchema],
  totalAmount: { type: Number, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed'], 
    default: 'pending' 
  },
  orderStatus: { 
    type: String, 
    enum: ['received', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'], 
    default: 'received' 
  },
  storeOwner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'StoreOwner', 
    required: true 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);