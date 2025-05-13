import express from 'express';
import Order from '../models/Order.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get orders with status filter
router.get('/', auth, async (req, res) => {
  try {
    const filter = {
      storeOwner: req.user.id,
      ...(req.query.status === 'active' && { orderStatus: { $ne: 'delivered' } }),
      ...(req.query.status === 'completed' && { orderStatus: 'delivered' })
    };
    
    const orders = await Order.find(filter).populate('items.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update order status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, storeOwner: req.user.id },
      { orderStatus: req.body.status },
      { new: true }
    ).populate('items.product');
    
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;