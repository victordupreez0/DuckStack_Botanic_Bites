
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// MongoDB connection
const ACCESS_STRING = process.env.ACCESS_STRING;
// If the connection string does not specify a database, add it here
const DB_NAME = 'Botanic-DB';
let connectionString = ACCESS_STRING;
if (!ACCESS_STRING.includes('/' + DB_NAME)) {
  // Insert database name before query params
  const [base, params] = ACCESS_STRING.split('?');
  connectionString = `${base}/${DB_NAME}?${params || ''}`;
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

// TODO: Add your routes here (import from routes folder)

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});