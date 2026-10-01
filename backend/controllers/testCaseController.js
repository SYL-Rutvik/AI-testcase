/**
 * Test Case Controller
 * 
 * Generates structured software test cases using Google Gemini AI API (@google/generative-ai)
 * with an intelligent Natural Language Test Generation Rule Engine fallback for offline/resilient operation.
 * Logs generation audit telemetry into SQLite database.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const dbService = require('../db/dbService');

// Track runtime metrics
const serverMetrics = {
  totalRequests: 0,
  liveAiRequests: 0,
  nlpEngineRequests: 0,
  lastGeneratedTime: null,
  totalTestCasesCreated: 0
};

/**
 * Intelligent NLP Test Case Generator
 * Dynamically analyzes requirement text to generate context-aware, tailored test cases.
 */
function generateDynamicTestCaseSuite(inputType, description) {
  const text = description.trim();
  const lowerText = text.toLowerCase();

  // Extract actor/role
  let actor = 'User';
  if (lowerText.includes('student')) actor = 'Student';
  else if (lowerText.includes('driver')) actor = 'Driver';
  else if (lowerText.includes('super admin')) actor = 'Super Admin';
  else if (lowerText.includes('admin')) actor = 'University Admin';
  else if (lowerText.includes('customer')) actor = 'Customer';
  else if (lowerText.includes('patient')) actor = 'Patient';
  else if (lowerText.includes('doctor')) actor = 'Doctor';
  else if (lowerText.includes('developer')) actor = 'Developer';

  // Extract action keywords
  let action = 'perform requested operation';
  if (lowerText.includes('scan') && lowerText.includes('qr')) {
    action = 'scan QR code and verify attendance';
  } else if (lowerText.includes('login') || lowerText.includes('sign in') || lowerText.includes('authenticate')) {
    action = 'authenticate credentials and establish session';
  } else if (lowerText.includes('checkout') || lowerText.includes('order') || lowerText.includes('discount')) {
    action = 'calculate cart total and apply promotional discount';
  } else if (lowerText.includes('stop') || lowerText.includes('bus') || lowerText.includes('route')) {
    action = 'manage transit route stops and timetable assignments';
  } else if (lowerText.includes('payment') || lowerText.includes('stripe')) {
    action = 'process transaction and verify payment confirmation';
  } else if (lowerText.includes('register') || lowerText.includes('signup')) {
    action = 'register new account and validate fields';
  } else {
    const firstSentence = text.split(/[.\n]/)[0] || 'process requirement';
    action = firstSentence.slice(0, 50).replace(/^(as a|i want to|when|given)\s+/i, '');
  }

  // Extract primary entity
  let entity = 'specification data';
  if (lowerText.includes('qr code') || lowerText.includes('qr')) entity = 'bus QR payload';
  else if (lowerText.includes('attendance')) entity = 'daily attendance record';
  else if (lowerText.includes('bus') || lowerText.includes('vehicle')) entity = 'bus fleet details';
  else if (lowerText.includes('route') || lowerText.includes('stop')) entity = 'transit route & stops';
  else if (lowerText.includes('password') || lowerText.includes('token') || lowerText.includes('jwt')) entity = 'authentication token';
  else if (lowerText.includes('order') || lowerText.includes('cart') || lowerText.includes('discount')) entity = 'order subtotal & promo';
  else if (lowerText.includes('user') || lowerText.includes('account')) entity = 'user profile record';

  const prefix = inputType === 'API Endpoint Spec' ? 'TC-API' : inputType === 'Feature Description' ? 'TC-FD' : 'TC-US';

  const cases = [
    {
      id: `${prefix}-001`,
      scenario: `Verify successful happy-path execution when ${actor} initiates: ${action}`,
      steps: [
        `1. Access target interface or API endpoint with valid ${actor} credentials`,
        `2. Supply all mandatory parameters for ${entity}`,
        `3. Trigger execution / submit action`,
        `4. Verify system confirmation and persistent state update`
      ],
      testData: `Valid ${entity} with compliant attributes | Actor: ${actor}`,
      expectedResult: `System successfully processes ${action}. Operation status confirmed and data persisted without errors.`,
      priority: 'High',
      type: 'Positive',
      status: 'Passed'
    },
    {
      id: `${prefix}-002`,
      scenario: `Verify system error handling when mandatory ${entity} parameters are missing or empty`,
      steps: [
        `1. Navigate to execution view for ${action}`,
        `2. Omit required input fields or provide empty payload values`,
        `3. Submit the request`
      ],
      testData: `Empty or null payload for ${entity}`,
      expectedResult: `System blocks submission, displays clear validation error banner ("Field required"), and retains form state.`,
      priority: 'High',
      type: 'Negative',
      status: 'Pending'
    },
    {
      id: `${prefix}-003`,
      scenario: `Verify unauthorized access prevention when an unauthenticated entity attempts ${action}`,
      steps: [
        `1. Attempt to invoke ${action} without valid session token or with an unauthorized role`,
        `2. Observe HTTP status and UI security barrier`
      ],
      testData: `Missing/Expired Auth Token or Cross-Tenant ID`,
      expectedResult: `Request is rejected with 401 Unauthorized or 403 Forbidden; system prevents unauthorized state mutation.`,
      priority: 'High',
      type: 'Negative',
      status: 'Pending'
    },
    {
      id: `${prefix}-004`,
      scenario: `Verify boundary condition limits and maximum payload capacity for ${entity}`,
      steps: [
        `1. Input maximum allowable boundary length/value for ${entity}`,
        `2. Verify system processes data at exact threshold`,
        `3. Increment input value beyond allowable threshold (Boundary + 1)`,
        `4. Verify system gracefully rejects excess input`
      ],
      testData: `Upper threshold limit: Max capacity / 255 chars / boundary integer`,
      expectedResult: `System cleanly handles threshold limit; rejects out-of-boundary values with informative notification.`,
      priority: 'Medium',
      type: 'Boundary',
      status: 'Pending'
    },
    {
      id: `${prefix}-005`,
      scenario: `Verify idempotent behavior and duplicate request prevention during rapid submissions`,
      steps: [
        `1. Initiate valid ${action}`,
        `2. Trigger repeated simultaneous submissions (double-click or concurrent network calls)`,
        `3. Check resulting record count in data store`
      ],
      testData: `Rapid duplicate trigger with identical transaction timestamp`,
      expectedResult: `System deduplicates concurrent requests; exactly one valid record is created without duplicate entries.`,
      priority: 'Medium',
      type: 'Negative',
      status: 'Pending'
    }
  ];

  return cases;
}

/**
 * Controller endpoint handler for POST /api/generate-test-cases
 */
const generateTestCases = async (req, res) => {
  serverMetrics.totalRequests += 1;
  serverMetrics.lastGeneratedTime = new Date().toISOString();

  try {
    const { inputType = "User Story", featureDescription = "" } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!featureDescription || featureDescription.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Feature description is required." });
    }

    console.log(`[API Request #${serverMetrics.totalRequests}] Input Type: "${inputType}", Length: ${featureDescription.length}`);

    // If Gemini API Key is configured, attempt live AI generation
    if (apiKey && apiKey.trim() !== '' && apiKey !== 'your_gemini_api_key_here') {
      const candidateModels = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];
      
      for (const modelName of candidateModels) {
        try {
          console.log(`🤖 Attempting Google Gemini AI model (${modelName})...`);
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({ model: modelName });

          const prompt = `
You are an expert Senior Software Quality Assurance (QA) Automation Engineer.
Generate 5 comprehensive, professional software test cases based on the provided ${inputType}.

Specification Format: ${inputType}
Requirement Details:
"""
${featureDescription}
"""

Requirements for JSON Output:
Return a valid, raw JSON array of objects. Do not include markdown code block formatting (no \`\`\`json).
Each object must have the following keys:
- "id": String (e.g. "TC-001", "TC-002")
- "scenario": String (clear test title)
- "steps": Array of Strings (numbered steps e.g. ["1. Step one", "2. Step two"])
- "testData": String (specific sample inputs or headers)
- "expectedResult": String (expected outcome criteria)
- "priority": String ("High", "Medium", or "Low")
- "type": String ("Positive", "Negative", or "Boundary")
- "status": String ("Pending")

Ensure the test suite includes at least 2 Positive scenarios, 2 Negative error scenarios, and 1 Boundary limit scenario.
`;

          const result = await model.generateContent(prompt);
          const response = await result.response;
          const rawText = response.text().trim();
          
          const cleanedJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsedData = JSON.parse(cleanedJson);

          if (Array.isArray(parsedData) && parsedData.length > 0) {
            serverMetrics.liveAiRequests += 1;
            serverMetrics.totalTestCasesCreated += parsedData.length;

            // Log to audit telemetry
            await dbService.logTelemetry('GEMINI_GENERATION', `Generated ${parsedData.length} cases via ${modelName} for ${inputType}`);

            return res.status(200).json({
              success: true,
              message: `Live test cases generated via Google Gemini AI (${modelName})`,
              meta: {
                inputType,
                isLiveAI: true,
                model: modelName,
                timestamp: new Date().toISOString(),
                totalGenerated: parsedData.length
              },
              data: parsedData
            });
          }
        } catch (aiError) {
          console.warn(`⚠️ Model ${modelName} failed: ${aiError.message}. Trying next option...`);
        }
      }
    }

    // Dynamic NLP Generator Fallback
    console.log("⚡ Generating context-aware test cases using Intelligent NLP Rule Engine...");
    const dynamicCases = generateDynamicTestCaseSuite(inputType, featureDescription);
    serverMetrics.nlpEngineRequests += 1;
    serverMetrics.totalTestCasesCreated += dynamicCases.length;

    // Log to audit telemetry
    await dbService.logTelemetry('NLP_GENERATION', `Generated ${dynamicCases.length} cases via NLP Engine for ${inputType}`);

    return res.status(200).json({
      success: true,
      message: `Test cases generated successfully via NLP QA Engine (${inputType})`,
      meta: {
        inputType,
        isLiveAI: false,
        engine: "Contextual NLP QA Generator",
        timestamp: new Date().toISOString(),
        totalGenerated: dynamicCases.length
      },
      data: dynamicCases
    });
  } catch (error) {
    console.error("Error generating test cases:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while generating test cases.",
      error: error.message
    });
  }
};

/**
 * Controller endpoint handler for GET /api/stats
 */
const getStats = (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      ...serverMetrics,
      status: 'operational',
      uptime: process.uptime()
    }
  });
};

module.exports = {
  generateTestCases,
  getStats
};
