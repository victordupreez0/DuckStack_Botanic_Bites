// Example admin controller
exports.dashboard = (req, res) => {
  res.json({ message: 'Welcome to the admin dashboard!' });
};

const { getUserCollection } = require('../models/User');

// Return a list of users for the admin panel
exports.getUsers = async (req, res) => {
  try {
    const usersCol = await getUserCollection();
    // Project only the fields we want to expose to the admin UI
    const users = await usersCol.find({}, { projection: { password: 0 } }).toArray();
    res.json(users);
  } catch (err) {
    console.error('Admin getUsers error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
