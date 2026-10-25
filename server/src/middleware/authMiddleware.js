// server/src/middleware/authMiddleware.js
import { verifyToken } from '../utils/jwtUtils.js';
import User from '../models/User.js';

/**
 * Protect routes by requiring a valid JWT access token
 */
export async function authenticate(req, res, next) {
  let token = null;

  // 1. Check Authorization Bearer header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.jwt) {
    // 2. Fallback to HttpOnly cookie if present
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in to proceed.'
    });
  }

  try {
    const decoded = verifyToken(token);

    // Verify user still exists in database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user account associated with this session no longer exists.'
      });
    }

    // Attach fresh user object to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Your session has expired. Please log in again.'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token. Please log in again.'
    });
  }
}
