const { getUserCollection } = require('../models/User');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

exports.googleLogin = async (req, res) => {
  try {
    const { id_token } = req.body;
    if (!id_token) return res.status(400).json({ message: 'id_token required' });

    const ticket = await googleClient.verifyIdToken({ idToken: id_token, audience: process.env.GOOGLE_CLIENT_ID });
  const payload = ticket.getPayload();
  if (!payload || !payload.email) return res.status(400).json({ message: 'Invalid token payload' });
  // Require Google-verified email by default
  if (!payload.email_verified) return res.status(403).json({ message: 'Google account email not verified' });

    const users = await getUserCollection();
    const email = payload.email;
    let user = await users.findOne({ email });

    if (!user) {
      const newUser = {
        name: payload.given_name || payload.name || '',
        surname: payload.family_name || '',
        username: (payload.email || '').split('@')[0],
        email,
        password: null,
        reseller: false,
        isAdmin: false,
        googleId: payload.sub,
        picture: payload.picture || null,
      };
      const result = await users.insertOne(newUser);
      user = { ...newUser, _id: result.insertedId };
    } else {
      // update googleId/picture if missing
      const updateFields = {};
      if (!user.googleId && payload.sub) updateFields.googleId = payload.sub;
      if (payload.picture && payload.picture !== user.picture) updateFields.picture = payload.picture;
      if (Object.keys(updateFields).length) await users.updateOne({ _id: user._id }, { $set: updateFields });
    }

    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
    const token = jwt.sign({
      id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin
    }, JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ message: 'Login successful', token, user: { id: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin } });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({ message: 'Google login failed' });
  }
};
