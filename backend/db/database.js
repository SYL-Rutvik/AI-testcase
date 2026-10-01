/**
 * SQLite Database Setup & Initialization
 * 
 * Provides connection, table initialization, and seed data for:
 * - users (with password hashing & roles)
 * - pricing_plans (dynamic subscription plans)
 * - preset_templates (dynamic requirement templates)
 * - test_suites & test_cases (persistent QA suites)
 * - audit_telemetry (system audit log)
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'aitestgen.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Failed to connect to SQLite database:', err.message);
  } else {
    console.log(`🗄️  Connected to SQLite database at: ${dbPath}`);
  }
});

// Helper for promise-based queries
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

/**
 * Initialize Tables and Seed Data
 */
async function initDatabase() {
  try {
    // 1. Users Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT,
        role TEXT NOT NULL DEFAULT 'user',
        plan TEXT NOT NULL DEFAULT 'Free Tier',
        generationsUsed INTEGER DEFAULT 0,
        freeLimit INTEGER DEFAULT 10,
        status TEXT DEFAULT 'Active',
        joinedDate TEXT NOT NULL,
        avatar TEXT,
        provider TEXT DEFAULT 'email',
        picture TEXT
      )
    `);

    // 2. Pricing Plans Table (Dynamic Subscription Plans)
    await dbRun(`
      CREATE TABLE IF NOT EXISTS pricing_plans (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        badge TEXT,
        price TEXT NOT NULL,
        priceValue INTEGER NOT NULL DEFAULT 0,
        period TEXT NOT NULL,
        description TEXT,
        features TEXT NOT NULL,
        isPopular INTEGER DEFAULT 0,
        isCurrent INTEGER DEFAULT 0,
        buttonText TEXT NOT NULL,
        sortOrder INTEGER DEFAULT 0
      )
    `);

    // 3. Preset Templates Table (Dynamic Requirements)
    await dbRun(`
      CREATE TABLE IF NOT EXISTS preset_templates (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        badge TEXT NOT NULL,
        inputType TEXT NOT NULL,
        description TEXT NOT NULL,
        sortOrder INTEGER DEFAULT 0
      )
    `);

    // 4. Test Suites Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS test_suites (
        id TEXT PRIMARY KEY,
        userId TEXT,
        title TEXT NOT NULL,
        inputType TEXT NOT NULL,
        isLiveAI INTEGER DEFAULT 0,
        testCasesCount INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL
      )
    `);

    // 5. Test Cases Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS test_cases (
        id TEXT PRIMARY KEY,
        suiteId TEXT NOT NULL,
        scenario TEXT NOT NULL,
        steps TEXT NOT NULL,
        testData TEXT,
        expectedResult TEXT NOT NULL,
        priority TEXT NOT NULL,
        type TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Pending',
        sortOrder INTEGER DEFAULT 0,
        FOREIGN KEY (suiteId) REFERENCES test_suites(id) ON DELETE CASCADE
      )
    `);

    // 6. Audit Telemetry Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS audit_telemetry (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        eventType TEXT NOT NULL,
        details TEXT,
        timestamp TEXT NOT NULL
      )
    `);

    // Seed default data if empty
    await seedInitialData();

  } catch (err) {
    console.error('❌ Error initializing database schema:', err);
  }
}

/**
 * Seed Initial Data
 */
async function seedInitialData() {
  // Check users count
  const userCount = await dbGet('SELECT COUNT(*) as count FROM users');
  if (userCount.count === 0) {
    console.log('🌱 Seeding initial user accounts (Admin & Users)...');
    
    const adminHash = await bcrypt.hash('Admin@123', 10);
    const userHash = await bcrypt.hash('User@123', 10);

    const initialUsers = [
      {
        id: 'USR-ADMIN-01',
        name: 'Prof. Jay Pithadiya',
        email: 'admin@rku.ac.in',
        password: adminHash,
        role: 'admin',
        plan: 'Enterprise',
        generationsUsed: 42,
        freeLimit: 999999,
        status: 'Active',
        joinedDate: '2026-08-01',
        avatar: 'JP',
        provider: 'email'
      },
      {
        id: 'USR-101',
        name: 'Rutvik Shiyal',
        email: 'rutvik.shiyal@rku.ac.in',
        password: userHash,
        role: 'user',
        plan: 'Free Tier',
        generationsUsed: 3,
        freeLimit: 10,
        status: 'Active',
        joinedDate: '2026-08-15',
        avatar: 'RS',
        provider: 'email'
      },
      {
        id: 'USR-103',
        name: 'Rahul Kanzariya',
        email: 'rahul.kanzariya@rku.ac.in',
        password: userHash,
        role: 'user',
        plan: 'Pro',
        generationsUsed: 19,
        freeLimit: 999999,
        status: 'Active',
        joinedDate: '2026-08-15',
        avatar: 'RK',
        provider: 'email'
      },
      {
        id: 'USR-104',
        name: 'Hardik Parekh',
        email: 'hardik.parekh@rku.ac.in',
        password: userHash,
        role: 'user',
        plan: 'Free Tier',
        generationsUsed: 9,
        freeLimit: 10,
        status: 'Active',
        joinedDate: '2026-08-22',
        avatar: 'HP',
        provider: 'email'
      }
    ];

    for (const u of initialUsers) {
      await dbRun(`
        INSERT INTO users (id, name, email, password, role, plan, generationsUsed, freeLimit, status, joinedDate, avatar, provider)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [u.id, u.name, u.email, u.password, u.role, u.plan, u.generationsUsed, u.freeLimit, u.status, u.joinedDate, u.avatar, u.provider]);
    }
  }

  // Check pricing plans count
  const planCount = await dbGet('SELECT COUNT(*) as count FROM pricing_plans');
  if (planCount.count === 0) {
    console.log('🌱 Seeding dynamic pricing plans...');
    const plans = [
      {
        id: 'plan-free',
        name: 'Free Starter',
        badge: 'Basic',
        price: '₹0',
        priceValue: 0,
        period: 'forever',
        description: 'Essential test case generation for individual developers & student projects.',
        features: JSON.stringify([
          '10 Free AI Test Suite Generations',
          'Standard Positive & Negative Case Generation',
          'Export to Excel (.xlsx), CSV & Clipboard',
          'LocalStorage & Cloud SQLite History',
          'Community Discord & Email Support'
        ]),
        isPopular: 0,
        isCurrent: 1,
        buttonText: 'Current Plan',
        sortOrder: 1
      },
      {
        id: 'plan-pro',
        name: 'Pro QA Engineer',
        badge: 'Recommended',
        price: '₹499',
        priceValue: 499,
        period: 'month',
        description: 'Full-power AI generation with deep security analysis & priority processing.',
        features: JSON.stringify([
          'Unlimited AI Test Suite Generations',
          'Deep Security & Boundary Limit Rules',
          'Print-Ready Landscape PDF Reports',
          'High-Speed Google Gemini Priority Inference',
          'JIRA & TestRail REST Export Hooks',
          'Export to BDD Gherkin & Playwright Syntax'
        ]),
        isPopular: 1,
        isCurrent: 0,
        buttonText: 'Upgrade to Pro Plan',
        sortOrder: 2
      },
      {
        id: 'plan-enterprise',
        name: 'Enterprise QA',
        badge: 'Teams',
        price: '₹1,499',
        priceValue: 1499,
        period: 'month',
        description: 'Engineered for multi-seat engineering teams & university departments.',
        features: JSON.stringify([
          'Unlimited Seats & Shared Repositories',
          'Automated Cypress & Playwright Code Synthesis',
          'Custom LLM Fine-Tuning on Organization Code',
          'Dedicated 24/7 SLA & Integration Engineer Support',
          'Multi-Tenant Super Admin Governance & RBAC',
          'Audit Log Telemetry & Cloud Storage'
        ]),
        isPopular: 0,
        isCurrent: 0,
        buttonText: 'Get Enterprise',
        sortOrder: 3
      }
    ];

    for (const p of plans) {
      await dbRun(`
        INSERT INTO pricing_plans (id, name, badge, price, priceValue, period, description, features, isPopular, isCurrent, buttonText, sortOrder)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [p.id, p.name, p.badge, p.price, p.priceValue, p.period, p.description, p.features, p.isPopular, p.isCurrent, p.buttonText, p.sortOrder]);
    }
  }

  // Check preset templates count
  const presetCount = await dbGet('SELECT COUNT(*) as count FROM preset_templates');
  if (presetCount.count === 0) {
    console.log('🌱 Seeding dynamic requirement templates...');
    const presets = [
      {
        id: 'preset-utms-qr',
        title: 'UTMS Student Bus QR Attendance',
        badge: '🚌 Transport / UTMS',
        inputType: 'User Story',
        description: `As a registered student,
I want to scan the official QR code displayed on my university bus using my mobile camera viewfinder,
So that my transit attendance is authenticated and saved to the Firestore cloud database in real time.

Acceptance Criteria:
1. Valid QR scan captures student ID, bus ID, timestamp, and marks attendance as Present.
2. Invalid or expired QR code payload displays an error alert.
3. Prevent duplicate attendance scans on the same route on the same date.
4. Cross-tenant access: Students cannot mark attendance on buses from another university.`,
        sortOrder: 1
      },
      {
        id: 'preset-ecommerce',
        title: 'E-Commerce Checkout & Discount',
        badge: '🛒 E-Commerce',
        inputType: 'Feature Description',
        description: `Feature: Shopping Cart Promotional Discount Engine.
When a customer adds items exceeding $100.00 subtotal and enters coupon code 'SAVE10',
the application must apply an automatic 10% discount deduction before tax calculation.

Rules:
- Order subtotal must be greater than or equal to $100.00.
- Expired promo codes must show error 'Coupon expired'.
- Max discount cannot exceed $50.00 per transaction.
- Only one promo code can be applied per order.`,
        sortOrder: 2
      },
      {
        id: 'preset-api-auth',
        title: 'POST /api/v1/auth/login',
        badge: '🔐 API Spec',
        inputType: 'API Endpoint Spec',
        description: `POST /api/v1/auth/login
Request Headers: Content-Type: application/json
Request Body:
{
  "email": "user@university.edu",
  "password": "SecurePassword123"
}

Expected Response (200 OK):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "uid": "usr_991", "role": "student", "universityId": "RKU" },
  "expiresIn": 86400
}

Error Conditions:
- 400 Bad Request if email format is invalid.
- 401 Unauthorized if password does not match.
- 429 Too Many Requests if rate limit (5 attempts/min) is exceeded.`,
        sortOrder: 3
      },
      {
        id: 'preset-route-management',
        title: 'University Bus Route & Stop Assignment',
        badge: '🚏 Transit Admin',
        inputType: 'Feature Description',
        description: `Feature: University Admin Bus Stop Allocation.
University Admins can define transit routes with sequenced pickup stops, landmarks, and departure timetables.

Requirements:
- Each route must have a unique Route ID, start terminal, and campus destination.
- Admin can reorder stops with drag-and-drop or sortOrder index.
- Total stops per bus route cannot exceed 25 stops.
- System must validate that arrival time at stop N is earlier than arrival time at stop N+1.`,
        sortOrder: 4
      }
    ];

    for (const pr of presets) {
      await dbRun(`
        INSERT INTO preset_templates (id, title, badge, inputType, description, sortOrder)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [pr.id, pr.title, pr.badge, pr.inputType, pr.description, pr.sortOrder]);
    }
  }

  // Check initial test suites count
  const suiteCount = await dbGet('SELECT COUNT(*) as count FROM test_suites');
  if (suiteCount.count === 0) {
    console.log('🌱 Seeding initial test suite and test cases...');
    const suiteId = 'SUITE-001';
    await dbRun(`
      INSERT INTO test_suites (id, userId, title, inputType, isLiveAI, testCasesCount, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [suiteId, 'USR-101', 'User Authentication & Login Flow', 'User Story', 1, 4, '2026-08-23']);

    const initialCases = [
      {
        id: 'TC-001',
        scenario: 'Verify successful user login with valid credentials',
        steps: JSON.stringify([
          '1. Navigate to the login page',
          '2. Enter registered email address',
          '3. Enter valid password',
          '4. Click on "Sign In" button'
        ]),
        testData: 'Email: user@example.com, Password: Password123!',
        expectedResult: 'User is successfully authenticated and redirected to the main dashboard with a welcome banner.',
        priority: 'High',
        type: 'Positive',
        status: 'Passed',
        sortOrder: 1
      },
      {
        id: 'TC-002',
        scenario: 'Verify login attempt with an invalid password',
        steps: JSON.stringify([
          '1. Navigate to the login page',
          '2. Enter valid email address',
          '3. Enter incorrect password',
          '4. Click on "Sign In" button'
        ]),
        testData: 'Email: user@example.com, Password: WrongPassword!',
        expectedResult: 'System displays error message "Invalid email or password" and remains on login page.',
        priority: 'High',
        type: 'Negative',
        status: 'Passed',
        sortOrder: 2
      },
      {
        id: 'TC-003',
        scenario: 'Verify email input field maximum character limit validation',
        steps: JSON.stringify([
          '1. Navigate to the login page',
          '2. Paste a 256-character string into the Email field',
          '3. Tab out of the field or attempt submission'
        ]),
        testData: 'Email string of 256 characters (a...a@domain.com)',
        expectedResult: 'Field prevents input beyond 255 characters or shows validation error "Email cannot exceed 255 characters".',
        priority: 'Medium',
        type: 'Boundary',
        status: 'Pending',
        sortOrder: 3
      },
      {
        id: 'TC-004',
        scenario: 'Verify "Forgot Password" link navigates to password recovery page',
        steps: JSON.stringify([
          '1. Navigate to the login page',
          '2. Locate and click on the "Forgot Password?" hyperlink'
        ]),
        testData: 'N/A',
        expectedResult: 'User is redirected to /reset-password URL and recovery form is visible.',
        priority: 'Low',
        type: 'Positive',
        status: 'Pending',
        sortOrder: 4
      }
    ];

    for (const c of initialCases) {
      await dbRun(`
        INSERT INTO test_cases (id, suiteId, scenario, steps, testData, expectedResult, priority, type, status, sortOrder)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [c.id, suiteId, c.scenario, c.steps, c.testData, c.expectedResult, c.priority, c.type, c.status, c.sortOrder]);
    }
  }
}

module.exports = {
  db,
  dbRun,
  dbAll,
  dbGet,
  initDatabase
};
