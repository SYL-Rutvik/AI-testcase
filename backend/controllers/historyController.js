/**
 * History Controller
 * 
 * Manages persistent test suite history and child test cases backed by
 * Universal Database Service (Cloud MongoDB Atlas & SQLite).
 */

const dbService = require('../db/dbService');

/**
 * GET /api/history
 */
const getHistory = async (req, res) => {
  try {
    const formattedHistory = await dbService.getHistory();
    return res.status(200).json({
      success: true,
      total: formattedHistory.length,
      history: formattedHistory
    });
  } catch (err) {
    console.error('Error fetching test suite history:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch test suite history.', error: err.message });
  }
};

/**
 * POST /api/history
 */
const saveTestSuite = async (req, res) => {
  try {
    const { title, inputType = 'User Story', testCases = [], isLiveAI = false } = req.body;
    const userId = req.user ? req.user.id : null;

    if (!title || !Array.isArray(testCases)) {
      return res.status(400).json({ success: false, message: 'Title and test cases array are required.' });
    }

    const suiteId = `SUITE-${Date.now().toString().slice(-4)}`;
    const createdAt = new Date().toISOString().slice(0, 10);

    await dbService.saveTestSuite(
      {
        id: suiteId,
        title,
        inputType,
        isLiveAI: Boolean(isLiveAI),
        createdAt
      },
      testCases,
      userId
    );

    await dbService.logTelemetry(
      'SUITE_CREATED',
      `Saved suite ${suiteId} with ${testCases.length} cases`
    );

    return res.status(201).json({
      success: true,
      message: 'Test suite saved successfully to database.',
      suite: {
        id: suiteId,
        title,
        inputType,
        timestamp: createdAt,
        isLiveAI: Boolean(isLiveAI),
        testCases
      }
    });
  } catch (err) {
    console.error('Error saving test suite:', err);
    return res.status(500).json({ success: false, message: 'Failed to save test suite.', error: err.message });
  }
};

/**
 * DELETE /api/history/:id
 */
const deleteTestSuite = async (req, res) => {
  try {
    const { id } = req.params;
    await dbService.deleteTestSuite(id);

    return res.status(200).json({
      success: true,
      message: `Test suite ${id} deleted successfully from database.`
    });
  } catch (err) {
    console.error('Error deleting test suite:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete test suite.', error: err.message });
  }
};

/**
 * GET /api/test-cases/initial
 */
const getInitialTestCases = async (req, res) => {
  try {
    const initial = await dbService.getInitialTestCases();
    return res.status(200).json({
      success: true,
      suiteId: initial.suiteId,
      testCases: initial.testCases
    });
  } catch (err) {
    console.error('Error fetching initial test cases:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getHistory,
  saveTestSuite,
  deleteTestSuite,
  getInitialTestCases
};
