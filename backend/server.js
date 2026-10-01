/**
 * AI-Powered Test Case Generator - Backend Server
 * 
 * Express backend server integrated with Hybrid Database Architecture
 * (Cloud MongoDB Atlas + Local SQLite Fallback), Role-Based Access Control,
 * and Google Gemini AI API.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./db/database');
const { connectMongoDB, isMongoActive } = require('./db/mongo');
const testCaseRoutes = require('./routes/testCaseRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Configuration
app.use(cors({
  origin: '*', // Allow development and production frontends
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api', testCaseRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  const dbEngine = isMongoActive() ? 'Cloud MongoDB Atlas Connected' : 'Local SQLite Connected';
  res.status(200).json({
    status: 'online',
    service: 'AI Test Case Generator Backend with RBAC & Gemini AI',
    databaseEngine: dbEngine,
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// Root Route
app.get('/', (req, res) => {
  const dbEngine = isMongoActive() ? 'Cloud MongoDB Atlas 🍃' : 'Local SQLite 🗄️';
  res.send(`
    <div style="font-family: sans-serif; padding: 40px; text-align: center; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4f46e5;">AI Test Case Generator API</h1>
      <p style="color: #4b5563; font-size: 16px;">Hybrid Database Express Backend Server is running successfully!</p>
      <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: left;">
        <p><strong>🗄️ Database Engine:</strong> ${dbEngine}</p>
        <p><strong>🔐 Auth & RBAC:</strong> Active (Admin + User dashboards)</p>
        <p><strong>🤖 Gemini AI Engine:</strong> ${process.env.GEMINI_API_KEY ? 'Active (Live Google Gemini)' : 'Contextual NLP Rule Engine'}</p>
      </div>
      <p style="font-size: 13px; color: #6b7280;">Endpoints: <code>/api/auth</code>, <code>/api/plans</code>, <code>/api/presets</code>, <code>/api/history</code>, <code>/api/admin</code></p>
    </div>
  `);
});

// Initialize Database and Start Server
async function startServer() {
  let dbEngineName = 'Local SQLite';

  if (process.env.MONGODB_URI) {
    const mongoConnected = await connectMongoDB();
    if (mongoConnected) {
      dbEngineName = 'Cloud MongoDB Atlas';
    }
  }

  // If MongoDB is not connected, ensure SQLite schema is ready
  if (!isMongoActive()) {
    await initDatabase();
  }

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🗄️  Active Database Engine: ${dbEngineName}`);
    console.log(`🔐 RBAC: Role-Based Access Control enabled`);
    console.log(`🤖 Gemini AI Status: ${process.env.GEMINI_API_KEY ? 'Active (Live AI)' : 'NLP Fallback Mode'}`);
    console.log(`📡 API Base: http://localhost:${PORT}/api`);
    console.log(`====================================================`);
  });
}

startServer();
