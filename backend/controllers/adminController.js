/**
 * Admin Controller
 * 
 * Manages administrative operations backed by Universal Database Service
 * (Cloud MongoDB Atlas & SQLite):
 * - User governance (View, Provision, Update role/plan/status, Delete)
 * - Live system telemetry & AI health metrics
 * - Protected by verifyToken and requireAdmin RBAC middleware
 */

const bcrypt = require('bcryptjs');
const dbService = require('../db/dbService');

/**
 * GET /api/admin/users
 */
const getAdminUsers = async (req, res) => {
  try {
    const users = await dbService.getAllUsers();
    return res.status(200).json({
      success: true,
      total: users.length,
      users
    });
  } catch (err) {
    console.error('Error in getAdminUsers:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch users.', error: err.message });
  }
};

/**
 * POST /api/admin/users
 */
const createAdminUser = async (req, res) => {
  try {
    const { name, email, password = 'User@123', role = 'user', plan = 'Free Tier', freeLimit = 10 } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await dbService.findUserByEmail(normalizedEmail);
    if (existing) {
      return res.status(409).json({ success: false, message: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newId = `USR-${Date.now().toString().slice(-4)}`;
    const avatar = name.slice(0, 2).toUpperCase();
    const joinedDate = new Date().toISOString().slice(0, 10);
    const assignedLimit = plan === 'Pro' || plan === 'Enterprise' ? 999999 : Number(freeLimit);

    const created = await dbService.createUser({
      id: newId,
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
      plan,
      generationsUsed: 0,
      freeLimit: assignedLimit,
      status: 'Active',
      joinedDate,
      avatar,
      provider: 'email'
    });

    await dbService.logTelemetry(
      'ADMIN_USER_CREATED',
      `Admin created user ${normalizedEmail} with role ${role}`
    );

    const { password: _, ...safeUser } = created;

    return res.status(201).json({
      success: true,
      message: `User ${name} provisioned successfully in database.`,
      user: safeUser
    });
  } catch (err) {
    console.error('Error in createAdminUser:', err);
    return res.status(500).json({ success: false, message: 'Failed to provision user.', error: err.message });
  }
};

/**
 * PATCH /api/admin/users/:id
 */
const updateAdminUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, plan, status, freeLimit } = req.body;

    const existing = await dbService.findUserById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'User not found in database.' });
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email.trim().toLowerCase();
    if (role !== undefined) updates.role = role;
    if (plan !== undefined) updates.plan = plan;
    if (status !== undefined) updates.status = status;
    if (freeLimit !== undefined) {
      updates.freeLimit = Number(freeLimit);
    } else if (plan === 'Pro' || plan === 'Enterprise') {
      updates.freeLimit = 999999;
    }

    const updated = await dbService.updateUser(id, updates);
    const { password: _, ...safeUser } = updated;

    return res.status(200).json({
      success: true,
      message: `User ${id} updated successfully in database.`,
      user: safeUser
    });
  } catch (err) {
    console.error('Error in updateAdminUser:', err);
    return res.status(500).json({ success: false, message: 'Failed to update user.', error: err.message });
  }
};

/**
 * DELETE /api/admin/users/:id
 */
const deleteAdminUser = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await dbService.findUserById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    await dbService.deleteUser(id);
    await dbService.logTelemetry(
      'ADMIN_USER_DELETED',
      `Admin deleted user ${existing.email}`
    );

    return res.status(200).json({
      success: true,
      message: `User ${id} removed permanently from database.`
    });
  } catch (err) {
    console.error('Error in deleteAdminUser:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete user.', error: err.message });
  }
};

/**
 * GET /api/admin/telemetry
 */
const getAdminTelemetry = async (req, res) => {
  try {
    const telemetryData = await dbService.getTelemetry();

    return res.status(200).json({
      success: true,
      telemetry: {
        ...telemetryData,
        geminiModel: 'gemini-1.5-flash',
        geminiStatus: process.env.GEMINI_API_KEY ? 'Configured & Online' : 'Offline Contextual NLP Engine',
        serverUptime: process.uptime(),
        memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
      }
    });
  } catch (err) {
    console.error('Error in getAdminTelemetry:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch telemetry.', error: err.message });
  }
};

module.exports = {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  getAdminTelemetry
};
