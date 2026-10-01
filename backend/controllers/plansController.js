/**
 * Pricing Plans Controller
 * 
 * Manages dynamic subscription plans backed by Universal Database Service
 * (Cloud MongoDB Atlas & SQLite) and handles in-app upgrades.
 */

const dbService = require('../db/dbService');

/**
 * GET /api/plans
 */
const getPricingPlans = async (req, res) => {
  try {
    const plans = await dbService.getPlans();
    return res.status(200).json({
      success: true,
      total: plans.length,
      plans
    });
  } catch (err) {
    console.error('Error fetching pricing plans:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch pricing plans.', error: err.message });
  }
};

/**
 * POST /api/plans/upgrade
 */
const upgradePlan = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : req.body.userId;
    const { planName = 'Pro' } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required to upgrade plan.' });
    }

    const user = await dbService.findUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    const isUnlimited = planName.toLowerCase() === 'pro' || planName.toLowerCase() === 'enterprise';
    const newFreeLimit = isUnlimited ? 999999 : 10;

    await dbService.updateUser(userId, {
      plan: planName,
      freeLimit: newFreeLimit
    });

    await dbService.logTelemetry(
      'PLAN_UPGRADE',
      `User ${user.email} upgraded to ${planName} Plan`
    );

    const updatedUser = await dbService.findUserById(userId);
    const { password: _, ...safeUser } = updatedUser;

    return res.status(200).json({
      success: true,
      message: `Successfully upgraded to ${planName} Plan! Unlimited test case generations activated.`,
      user: safeUser
    });
  } catch (err) {
    console.error('Error upgrading plan:', err);
    return res.status(500).json({ success: false, message: 'Failed to process plan upgrade.', error: err.message });
  }
};

/**
 * POST /api/plans/reset-credits
 */
const resetDemoCredits = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : req.body.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    await dbService.updateUser(userId, {
      generationsUsed: 0,
      plan: 'Free Tier',
      freeLimit: 10
    });

    const updatedUser = await dbService.findUserById(userId);
    const { password: _, ...safeUser } = updatedUser;

    return res.status(200).json({
      success: true,
      message: 'Demo usage credits reset to 0! Complete 10-quota test cycle restored.',
      user: safeUser
    });
  } catch (err) {
    console.error('Error resetting demo credits:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getPricingPlans,
  upgradePlan,
  resetDemoCredits
};
