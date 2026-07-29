/**
 * AI-Powered Test Case Generator - Backend Server
 * 
 * Entry point for the Express backend server.
 * Provides RESTful API endpoints for the React frontend application.
 */

const express = require('express');
const cors = require('cors');
const testCaseRoutes = require('./routes/testCaseRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Configuration
// 1. CORS: Enable Cross-Origin Resource Sharing so React frontend (port 5173 / 3000) can access this server
app.use(cors());

// 2. JSON Body Parser: Parses incoming requests with JSON payloads
app.use(express.json());

// Request Logging Middleware (Helpful for debugging during viva demo)
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api', testCaseRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'AI Test Case Generator Backend',
    timestamp: new Date().toISOString()
  });
});

// Root Route
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; padding: 40px; text-align: center;">
      <h1 style="color: #3b82f6;">AI Test Case Generator API</h1>
      <p>Express Backend Server is running successfully!</p>
      <p>POST endpoint available at: <code>/api/generate-test-cases</code></p>
    </div>
  `);
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API Endpoint: http://localhost:${PORT}/api/generate-test-cases`);
  console.log(`====================================================`);
});
