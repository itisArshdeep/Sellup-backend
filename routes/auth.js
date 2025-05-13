const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const StoreOwner = require('../models/StoreOwner');

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, storeName, upiId } = req.body;
    const storeSlug = storeName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const owner = new StoreOwner({
      email,
      password: hashedPassword,
      storeName,
      storeSlug,
      upiId
    });
    
    await owner.save();
    const token = jwt.sign({ id: owner._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, owner });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const owner = await StoreOwner.findOne({ email });
    if (!owner) throw new Error('Invalid credentials');
    
    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) throw new Error('Invalid credentials');
    
    const token = jwt.sign({ id: owner._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, owner });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;