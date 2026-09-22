import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.JWT_SECRET || process.env.SECRETS || 'picfinity_secret_key_2026';

export default function authMiddleware(req, res, next) {
  let token = req.headers.token || req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      Api_Response: 401,
      message: 'Authentication token required'
    });
  }

  if (typeof token === 'string' && token.startsWith('Bearer ')) {
    token = token.slice(7).trim();
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    // Support both scalar userId and object { user_id } or { id }
    if (typeof decoded === 'object' && decoded !== null) {
      req.user_id = decoded.user_id || decoded.id || decoded.sub;
    } else {
      req.user_id = decoded;
    }

    if (!req.user_id) {
      return res.status(401).json({ Api_Response: 401, message: 'Invalid token payload' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ Api_Response: 401, message: 'Invalid or expired token' });
  }
}
