
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors'); // Added CORS
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());

// MongoDB connection
const ACCESS_STRING = process.env.ACCESS_STRING;
const DB_NAME = 'Botanic-DB';
let connectionString = ACCESS_STRING;
// Fix: If the connection string does not already specify a database, add it (no leading slash)
const regexDb = /mongodb(?:\+srv)?:\/\/[^\/]+\/(\w+)/;
if (!regexDb.test(ACCESS_STRING)) {
  // Insert database name before query params, without double slash
  const [base, params] = ACCESS_STRING.split('?');
  connectionString = `${base}${DB_NAME ? '/' + DB_NAME : ''}${params ? '?' + params : ''}`;
}

mongoose.connect(connectionString)
  .then(() => console.log('Connected to MongoDB'))
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

// Product routes
const productRoutes = require('./routes/product');
app.use('/api/products', productRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});