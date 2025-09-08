const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Middleware to verify JWT and attach user info to req.user
module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    console.warn('Auth middleware: missing Authorization header');
    return res.status(401).json({ message: 'No token provided' });
  }
  // support both "Bearer <token>" and raw token
  const token = authHeader.includes(' ') ? authHeader.split(' ')[1] : authHeader;
  if (!token) {
    console.warn('Auth middleware: Authorization header present but token part is empty', { authHeader });
    return res.status(401).json({ message: 'No token provided' });
  }
  // log token length (do not print full token in production)
  console.debug(`Auth middleware: verifying token (len=${String(token).length})`);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.warn('Auth middleware: JWT verification failed', { message: err && err.message });
      return res.status(403).json({ message: 'Invalid token', details: err && err.message });
    }
    req.user = user;
    next();
  });
};
