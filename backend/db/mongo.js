/**
 * MongoDB Atlas Connection & Seeding Module
 * 
 * Manages connection to Cloud MongoDB Atlas using Mongoose.
 * Automatically seeds default users, pricing plans, and presets if collections are empty.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const PricingPlan = require('../models/PricingPlan');
const PresetTemplate = require('../models/PresetTemplate');
const TestSuite = require('../models/TestSuite');
const TestCase = require('../models/TestCase');
const AuditTelemetry = require('../models/AuditTelemetry');

let isConnected = false;

/**
 * Connect to MongoDB Atlas or local MongoDB
 */
async function connectMongoDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('ℹ️  MONGODB_URI not found in environment. Operating in Local SQLite mode.');
    return false;
  }

  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = true;
    console.log('🍃 Successfully connected to Cloud MongoDB Atlas!');
    
    // Seed initial collections if empty
    await seedMongoDatabase();
    return true;
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB Atlas:', err.message);
    console.log('⚠️  Falling back to Local SQLite database.');
    isConnected = false;
    return false;
  }
}

function isMongoActive() {
  return isConnected && mongoose.connection.readyState === 1;
}

/**
 * Seed MongoDB collections with default data
 */
async function seedMongoDatabase() {
  try {
    // 1. Seed Users
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding MongoDB Users collection...');
      const adminHash = await bcrypt.hash('Admin@123', 10);
      const userHash = await bcrypt.hash('User@123', 10);

      await User.insertMany([
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
      ]);
      console.log('✅ Seeded default users in MongoDB Atlas');
    }

    // 2. Seed Pricing Plans
    const planCount = await PricingPlan.countDocuments();
    if (planCount === 0) {
      console.log('🌱 Seeding MongoDB Pricing Plans...');
      await PricingPlan.insertMany([
        {
          id: 'plan-free',
          name: 'Free Starter',
          badge: 'Basic',
          price: '₹0',
          priceValue: 0,
          period: 'forever',
          description: 'Essential test case generation for individual developers & student projects.',
          features: [
            '10 Free AI Test Suite Generations',
            'Standard Positive & Negative Case Generation',
            'Export to Excel (.xlsx), CSV & Clipboard',
            'LocalStorage & Cloud MongoDB History',
            'Community Discord & Email Support'
          ],
          isPopular: false,
          isCurrent: true,
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
          features: [
            'Unlimited AI Test Suite Generations',
            'Deep Security & Boundary Limit Rules',
            'Print-Ready Landscape PDF Reports',
            'High-Speed Google Gemini Priority Inference',
            'JIRA & TestRail REST Export Hooks',
            'Export to BDD Gherkin & Playwright Syntax'
          ],
          isPopular: true,
          isCurrent: false,
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
          features: [
            'Unlimited Seats & Shared Repositories',
            'Automated Cypress & Playwright Code Synthesis',
            'Custom LLM Fine-Tuning on Organization Code',
            'Dedicated 24/7 SLA & Integration Engineer Support',
            'Multi-Tenant Super Admin Governance & RBAC',
            'Audit Log Telemetry & Cloud Storage'
          ],
          isPopular: false,
          isCurrent: false,
          buttonText: 'Get Enterprise',
          sortOrder: 3
        }
      ]);
      console.log('✅ Seeded pricing plans in MongoDB Atlas');
    }

    // 3. Seed Preset Templates
    const presetCount = await PresetTemplate.countDocuments();
    if (presetCount === 0) {
      console.log('🌱 Seeding MongoDB Preset Templates...');
      await PresetTemplate.insertMany([
        {
          id: 'preset-utms-qr',
          title: 'UTMS Student Bus QR Attendance',
          badge: '🚌 Transport / UTMS',
          inputType: 'User Story',
          description: `As a registered student,\nI want to scan the official QR code displayed on my university bus using my mobile camera viewfinder,\nSo that my transit attendance is authenticated and saved to the cloud database in real time.\n\nAcceptance Criteria:\n1. Valid QR scan captures student ID, bus ID, timestamp, and marks attendance as Present.\n2. Invalid or expired QR code payload displays an error alert.\n3. Prevent duplicate attendance scans on the same route on the same date.\n4. Cross-tenant access: Students cannot mark attendance on buses from another university.`,
          sortOrder: 1
        },
        {
          id: 'preset-ecommerce',
          title: 'E-Commerce Checkout & Discount',
          badge: '🛒 E-Commerce',
          inputType: 'Feature Description',
          description: `Feature: Shopping Cart Promotional Discount Engine.\nWhen a customer adds items exceeding $100.00 subtotal and enters coupon code 'SAVE10',\nthe application must apply an automatic 10% discount deduction before tax calculation.\n\nRules:\n- Order subtotal must be greater than or equal to $100.00.\n- Expired promo codes must show error 'Coupon expired'.\n- Max discount cannot exceed $50.00 per transaction.\n- Only one promo code can be applied per order.`,
          sortOrder: 2
        },
        {
          id: 'preset-api-auth',
          title: 'POST /api/v1/auth/login',
          badge: '🔐 API Spec',
          inputType: 'API Endpoint Spec',
          description: `POST /api/v1/auth/login\nRequest Headers: Content-Type: application/json\nRequest Body:\n{\n  "email": "user@university.edu",\n  "password": "SecurePassword123"\n}\n\nExpected Response (200 OK):\n{\n  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",\n  "user": { "uid": "usr_991", "role": "student", "universityId": "RKU" },\n  "expiresIn": 86400\n}\n\nError Conditions:\n- 400 Bad Request if email format is invalid.\n- 401 Unauthorized if password does not match.\n- 429 Too Many Requests if rate limit (5 attempts/min) is exceeded.`,
          sortOrder: 3
        },
        {
          id: 'preset-route-management',
          title: 'University Bus Route & Stop Assignment',
          badge: '🚏 Transit Admin',
          inputType: 'Feature Description',
          description: `Feature: University Admin Bus Stop Allocation.\nUniversity Admins can define transit routes with sequenced pickup stops, landmarks, and departure timetables.\n\nRequirements:\n- Each route must have a unique Route ID, start terminal, and campus destination.\n- Admin can reorder stops with drag-and-drop or sortOrder index.\n- Total stops per bus route cannot exceed 25 stops.\n- System must validate that arrival time at stop N is earlier than arrival time at stop N+1.`,
          sortOrder: 4
        }
      ]);
      console.log('✅ Seeded presets in MongoDB Atlas');
    }

    // 4. Seed Initial Test Suites & Cases
    const suiteCount = await TestSuite.countDocuments();
    if (suiteCount === 0) {
      console.log('🌱 Seeding MongoDB Initial Test Suite...');
      const suiteId = 'SUITE-001';
      await TestSuite.create({
        id: suiteId,
        userId: 'USR-101',
        title: 'User Authentication & Login Flow',
        inputType: 'User Story',
        isLiveAI: true,
        testCasesCount: 4,
        createdAt: '2026-08-23'
      });

      await TestCase.insertMany([
        {
          id: 'TC-001',
          suiteId,
          scenario: 'Verify successful user login with valid credentials',
          steps: [
            '1. Navigate to the login page',
            '2. Enter registered email address',
            '3. Enter valid password',
            '4. Click on "Sign In" button'
          ],
          testData: 'Email: user@example.com, Password: Password123!',
          expectedResult: 'User is successfully authenticated and redirected to the main dashboard with a welcome banner.',
          priority: 'High',
          type: 'Positive',
          status: 'Passed',
          sortOrder: 1
        },
        {
          id: 'TC-002',
          suiteId,
          scenario: 'Verify login attempt with an invalid password',
          steps: [
            '1. Navigate to the login page',
            '2. Enter valid email address',
            '3. Enter incorrect password',
            '4. Click on "Sign In" button'
          ],
          testData: 'Email: user@example.com, Password: WrongPassword!',
          expectedResult: 'System displays error message "Invalid email or password" and remains on login page.',
          priority: 'High',
          type: 'Negative',
          status: 'Passed',
          sortOrder: 2
        },
        {
          id: 'TC-003',
          suiteId,
          scenario: 'Verify email input field maximum character limit validation',
          steps: [
            '1. Navigate to the login page',
            '2. Paste a 256-character string into the Email field',
            '3. Tab out of the field or attempt submission'
          ],
          testData: 'Email string of 256 characters (a...a@domain.com)',
          expectedResult: 'Field prevents input beyond 255 characters or shows validation error "Email cannot exceed 255 characters".',
          priority: 'Medium',
          type: 'Boundary',
          status: 'Pending',
          sortOrder: 3
        },
        {
          id: 'TC-004',
          suiteId,
          scenario: 'Verify "Forgot Password" link navigates to password recovery page',
          steps: [
            '1. Navigate to the login page',
            '2. Locate and click on the "Forgot Password?" hyperlink'
          ],
          testData: 'N/A',
          expectedResult: 'User is redirected to /reset-password URL and recovery form is visible.',
          priority: 'Low',
          type: 'Positive',
          status: 'Pending',
          sortOrder: 4
        }
      ]);
      console.log('✅ Seeded initial test suite & cases in MongoDB Atlas');
    }
  } catch (err) {
    console.error('Error seeding MongoDB:', err);
  }
}

module.exports = {
  connectMongoDB,
  isMongoActive,
  seedMongoDatabase,
  models: {
    User,
    PricingPlan,
    PresetTemplate,
    TestSuite,
    TestCase,
    AuditTelemetry
  }
};
