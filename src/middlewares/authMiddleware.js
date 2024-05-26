const jwt = require('jsonwebtoken');
const pool = require('../utils/db');

const authenticate = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [decoded.userId]);
    if (rows.length > 0) {
      req.user = rows[0];
      next();
    } else {
      throw new Error();
    }
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
