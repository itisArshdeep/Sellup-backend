require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const storeRoutes = require('./routes/store');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/store', storeRoutes);

// Serve static files in production
const clientBuildPath = path.join(__dirname, 'client', 'build');
app.use(express.static(clientBuildPath));

// Serve React app for /store/:slug route
app.get('/store/:slug', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Optionally handle other routes (if needed)
app.get('/other-route', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));