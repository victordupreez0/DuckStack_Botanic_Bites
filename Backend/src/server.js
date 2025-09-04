
require('dotenv').config();
const express = require('express');

const cors = require('cors'); // Added CORS
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());

// MongoDB connection test at startup
const { MongoClient } = require('mongodb');
const ACCESS_STRING = process.env.ACCESS_STRING;
const DB_NAME = 'Botanic-DB';
const client = new MongoClient(ACCESS_STRING);
client.connect()
  .then(() => {
    console.log('Connected to MongoDB!');
    client.db(DB_NAME).command({ ping: 1 });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Basic route
app.get('/', (req, res) => {
  res.send('Server is running and connected to MongoDB!');
});


// Auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Auth and admin middleware
const auth = require('./middleware/auth');
const isAdmin = require('./middleware/isAdmin');

// Product routes (protect add/delete with auth & admin)
const productRoutes = require('./routes/product');
app.use('/api/products', productRoutes); // We'll update product.js to use middleware

// Admin routes (protected)
const adminRoutes = require('./routes/admin');
app.use('/api/admin', auth, isAdmin, adminRoutes);

// Catch-all for debugging unknown requests
app.use((req, res, next) => {
  console.log('Unhandled request:', req.method, req.originalUrl);
  next();
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});