const { getUserCollection } = require('../models/User');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
  try {
    const { name, surname, username, email, password, reseller } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required.' });
    }
    const users = await getUserCollection();
    const existingUser = await users.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      name,
      surname,
      username,
      email,
      password: hashedPassword,
      reseller: !!reseller,
      isAdmin: false
    };
    await users.insertOne(user);
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await getUserCollection();
    const user = await users.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
    const token = jwt.sign({
      id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin
    }, JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
