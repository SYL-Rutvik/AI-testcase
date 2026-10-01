/**
 * Presets Controller
 * 
 * Fetches dynamic requirement templates backed by Universal Database Service
 * (Cloud MongoDB Atlas & SQLite).
 */

const dbService = require('../db/dbService');

/**
 * GET /api/presets
 */
const getPresets = async (req, res) => {
  try {
    const presets = await dbService.getPresets();
    return res.status(200).json({
      success: true,
      total: presets.length,
      presets
    });
  } catch (err) {
    console.error('Error fetching presets:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch preset templates.', error: err.message });
  }
};

module.exports = {
  getPresets
};
