const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');
const Order = require('../models/Order');

router.use(auth);

// Get dashboard data
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ storeOwner: req.user.id });
    const orders = await Order.find({ storeOwner: req.user.id }).sort({ createdAt: -1 }).limit(10);
    res.json({ products, orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Product CRUD operations
router.post('/products', async (req, res) => {
  try {
    const product = new Product({ ...req.body, storeOwner: req.user.id });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find({ storeOwner: req.user.id })
                           .sort({ createdAt: -1 })
                           .populate('items.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update order status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { 
        _id: req.params.id,
        storeOwner: req.user.id // Ensure owner can only update their own orders
      },
      { orderStatus: req.body.status },
      { new: true }
    ).populate('items.product');

    if (!order) throw new Error('Order not found');
    res.json(order);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// Update Product
router.put('/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: req.params.id, storeOwner: req.user.id },
      req.body,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found or unauthorized' });
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Product
router.delete('/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({
      _id: req.params.id,
      storeOwner: req.user.id
    });

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found or unauthorized' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ... (add order status update endpoint)

module.exports = router;