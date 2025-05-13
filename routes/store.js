const express = require('express');
const router = express.Router();
const StoreOwner = require('../models/StoreOwner');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Get store by slug
router.get('/:slug', async (req, res) => {
  try {
    const store = await StoreOwner.findOne({ storeSlug: req.params.slug });
    if (!store) return res.status(404).json({ error: 'Store not found' });
    
    const products = await Product.find({ storeOwner: store._id, isAvailable: true });
    console.log(products);
    
    res.json({ store, products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Place order
router.post('/:slug/orders', async (req, res) => {
  try {
    const store = await StoreOwner.findOne({ storeSlug: req.params.slug });
    if (!store) return res.status(404).json({ error: 'Store not found' });

    const { customerName, customerAddress, customerPhone, items } = req.body;
    
    let totalAmount = 0;
    const orderItems = [];
    
    // Verify all products belong to this store
    for (const item of items) {
      const product = await Product.findOne({
        _id: item.productId,
        storeOwner: store._id
      });
      
      if (!product) throw new Error(`Product not found in your store: ${item.productId}`);
      
      totalAmount += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        priceAtOrder: product.price
      });
    }

    const order = new Order({
      customerName,
      customerAddress,
      customerPhone,
      items: orderItems,
      totalAmount,
      storeOwner: store._id,
      paymentStatus: 'pending',
      orderStatus: 'received'
    });

    await order.save();
    
    res.status(201).json({ 
      order,
      paymentLink: `upi://pay?pa=${store.upiId}&pn=${store.storeName}&am=${totalAmount}&cu=INR&tn=Order ${order._id}`
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router; 