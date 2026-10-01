/**
 * API Routes Module
 * 
 * Centralized REST API routing with authentication guards and role-based access control.
 */

const express = require('express');
const router = express.Router();

// Middleware
const { verifyToken, optionalAuth, requireAdmin } = require('../middleware/authMiddleware');

// Controllers
const { generateTestCases, getStats } = require('../controllers/testCaseController');
const { 
  loginWithEmail, 
  registerWithEmail, 
  loginWithGoogle, 
  getCurrentUser 
} = require('../controllers/authController');
const { 
  getPricingPlans, 
  upgradePlan, 
  resetDemoCredits 
} = require('../controllers/plansController');
const { getPresets } = require('../controllers/presetsController');
const { 
  getHistory, 
  saveTestSuite, 
  deleteTestSuite, 
  getInitialTestCases 
} = require('../controllers/historyController');
const { 
  getAdminUsers, 
  createAdminUser, 
  updateAdminUser, 
  deleteAdminUser, 
  getAdminTelemetry 
} = require('../controllers/adminController');

// ==========================================
// 1. PUBLIC & DYNAMIC DATA ENDPOINTS
// ==========================================

// GET /api/plans - Fetch dynamic pricing plans from SQLite
router.get('/plans', getPricingPlans);

// GET /api/presets - Fetch dynamic requirement templates from SQLite
router.get('/presets', getPresets);

// GET /api/test-cases/initial - Fetch default seed test cases from SQLite
router.get('/test-cases/initial', getInitialTestCases);

// GET /api/stats - Server metrics
router.get('/stats', getStats);

// POST /api/generate-test-cases - AI Test Case Generator
router.post('/generate-test-cases', generateTestCases);

// ==========================================
// 2. AUTHENTICATION ENDPOINTS
// ==========================================
router.post('/auth/login', loginWithEmail);
router.post('/auth/register', registerWithEmail);
router.post('/auth/google', loginWithGoogle);
router.get('/auth/me', verifyToken, getCurrentUser);

// ==========================================
// 3. PLANS & CREDITS (In-App Modal Upgrades)
// ==========================================
router.post('/plans/upgrade', optionalAuth, upgradePlan);
router.post('/plans/reset-credits', optionalAuth, resetDemoCredits);

// ==========================================
// 4. PERSISTENT HISTORY ARCHIVE (SQLite)
// ==========================================
router.get('/history', optionalAuth, getHistory);
router.post('/history', optionalAuth, saveTestSuite);
router.delete('/history/:id', optionalAuth, deleteTestSuite);

// ==========================================
// 5. PROTECTED ADMIN PORTAL ENDPOINTS (RBAC)
// ==========================================
// Require valid JWT authentication AND 'admin' role
router.get('/admin/users', verifyToken, requireAdmin, getAdminUsers);
router.post('/admin/users', verifyToken, requireAdmin, createAdminUser);
router.patch('/admin/users/:id', verifyToken, requireAdmin, updateAdminUser);
router.delete('/admin/users/:id', verifyToken, requireAdmin, deleteAdminUser);
router.get('/admin/telemetry', verifyToken, requireAdmin, getAdminTelemetry);

module.exports = router;
