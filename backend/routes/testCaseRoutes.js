/**
 * Test Case Routes Module
 * 
 * Defines routing endpoints for test case operations.
 */

const express = require('express');
const router = express.Router();
const { generateTestCases } = require('../controllers/testCaseController');

// POST /api/generate-test-cases
// Endpoint to receive requirements and respond with test cases
router.post('/generate-test-cases', generateTestCases);

module.exports = router;
