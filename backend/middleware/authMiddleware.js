/**
 * Authentication and RBAC Middleware
 * 
 * Verifies JWT tokens and enforces Role-Based Access Control (RBAC).
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ai_test_case_generator_super_secret_jwt_key_2026';

/**
 * Verify JWT token from Authorization header
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided. Please sign in.'
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      message: 'Malformed authorization token. Format must be "Bearer <token>".'
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication session. Please sign in again.'
    });
  }
};

/**
 * Optional Authentication: Attaches req.user if token is present, but doesn't block if missing
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      // Ignore token failure for optional endpoints
    }
  }
  next();
};

/**
 * RBAC: Require Administrator role
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required to access administrator endpoints.'
    });
  }

  const role = (req.user.role || '').toLowerCase();
  const isAdmin = role === 'admin' || role.includes('admin') || role.includes('lead');

  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Forbidden. Administrative privileges required to access this resource.'
    });
  }

  next();
};

/**
 * Helper to generate JWT Token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      plan: user.plan
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = {
  verifyToken,
  optionalAuth,
  requireAdmin,
  generateToken,
  JWT_SECRET
};
