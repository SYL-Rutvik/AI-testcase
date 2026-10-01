/**
 * Authentication Controller
 * 
 * Handles user authentication, registration, Google OAuth, and profile retrieval
 * backed by Universal Database Service (Hybrid Cloud MongoDB Atlas & SQLite).
 */

const bcrypt = require('bcryptjs');
const dbService = require('../db/dbService');
const { generateToken } = require('../middleware/authMiddleware');

/**
 * POST /api/auth/login
 */
const loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await dbService.findUserByEmail(normalizedEmail);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Verify password with bcrypt
    let isMatch = false;
    if (user.password) {
      if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
        isMatch = await bcrypt.compare(password, user.password);
      } else {
        isMatch = (password === user.password);
      }
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (user.status === 'Suspended') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended. Please contact administrator.' });
    }

    const token = generateToken(user);
    const { password: _, ...safeUser } = user;

    // Determine target dashboard based on RBAC
    const isAdmin = (user.role || '').toLowerCase() === 'admin' || (user.role || '').toLowerCase().includes('admin');
    const redirectDashboard = isAdmin ? 'admin' : 'dashboard';

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}! Authenticated as ${user.role}.`,
      token,
      user: safeUser,
      role: user.role,
      redirectDashboard
    });
  } catch (err) {
    console.error('Error in loginWithEmail:', err);
    return res.status(500).json({ success: false, message: 'Server error during login.', error: err.message });
  }
};

/**
 * POST /api/auth/register
 */
const registerWithEmail = async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await dbService.findUserByEmail(normalizedEmail);
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists. Please sign in.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserId = `USR-${Date.now().toString().slice(-4)}`;
    const avatar = name.slice(0, 2).toUpperCase();
    const joinedDate = new Date().toISOString().slice(0, 10);
    const normalizedRole = role.toLowerCase().includes('admin') ? 'admin' : 'user';

    const newUser = await dbService.createUser({
      id: newUserId,
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: normalizedRole,
      plan: 'Free Tier',
      generationsUsed: 0,
      freeLimit: 10,
      status: 'Active',
      joinedDate,
      avatar,
      provider: 'email'
    });

    const token = generateToken(newUser);
    const { password: _, ...safeUser } = newUser;
    const redirectDashboard = normalizedRole === 'admin' ? 'admin' : 'dashboard';

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! 10 free AI test generations unlocked.',
      token,
      user: safeUser,
      role: normalizedRole,
      redirectDashboard
    });
  } catch (err) {
    console.error('Error in registerWithEmail:', err);
    return res.status(500).json({ success: false, message: 'Server error during registration.', error: err.message });
  }
};

/**
 * POST /api/auth/google
 */
const loginWithGoogle = async (req, res) => {
  try {
    const { email, name, picture } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Google email is required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = await dbService.findUserByEmail(normalizedEmail);

    if (!user) {
      const newUserId = `GOOGLE-${Date.now().toString().slice(-4)}`;
      const userName = name || normalizedEmail.split('@')[0];
      const avatar = userName.slice(0, 2).toUpperCase();
      const joinedDate = new Date().toISOString().slice(0, 10);

      user = await dbService.createUser({
        id: newUserId,
        name: userName,
        email: normalizedEmail,
        role: 'user',
        plan: 'Free Tier',
        generationsUsed: 0,
        freeLimit: 10,
        status: 'Active',
        joinedDate,
        avatar,
        provider: 'google',
        picture: picture || null
      });
    }

    if (user.status === 'Suspended') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended. Please contact administrator.' });
    }

    const token = generateToken(user);
    const { password: _, ...safeUser } = user;

    const isAdmin = (user.role || '').toLowerCase() === 'admin' || (user.role || '').toLowerCase().includes('admin');
    const redirectDashboard = isAdmin ? 'admin' : 'dashboard';

    return res.status(200).json({
      success: true,
      message: `Google authentication successful. Welcome, ${user.name}!`,
      token,
      user: safeUser,
      role: user.role,
      redirectDashboard
    });
  } catch (err) {
    console.error('Error in loginWithGoogle:', err);
    return res.status(500).json({ success: false, message: 'Server error during Google login.', error: err.message });
  }
};

/**
 * GET /api/auth/me
 */
const getCurrentUser = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authenticated.' });
    }

    const user = await dbService.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const { password: _, ...safeUser } = user;
    return res.status(200).json({ success: true, user: safeUser });
  } catch (err) {
    console.error('Error in getCurrentUser:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  getCurrentUser
};
