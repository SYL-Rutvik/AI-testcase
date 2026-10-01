/**
 * One-Click SQLite to MongoDB Atlas Migration Tool
 * 
 * Run with: npm run db:migrate-mongo
 * Usage: Reads all data from local SQLite database (backend/data/aitestgen.db)
 * and safely migrates all users, pricing plans, templates, test suites, and test cases
 * into your Cloud MongoDB Atlas database.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { dbAll } = require('../db/database');
const User = require('../models/User');
const PricingPlan = require('../models/PricingPlan');
const PresetTemplate = require('../models/PresetTemplate');
const TestSuite = require('../models/TestSuite');
const TestCase = require('../models/TestCase');
const AuditTelemetry = require('../models/AuditTelemetry');

async function runMigration() {
  console.log('\n======================================================');
  console.log('🚀 SQLITE TO CLOUD MONGODB ATLAS MIGRATION TOOL');
  console.log('======================================================\n');

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('❌ MONGODB_URI is not set in backend/.env!');
    console.log('\n👉 Please add your MongoDB Atlas connection string to backend/.env:');
    console.log('   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/ai-testcase?retryWrites=true&w=majority\n');
    process.exit(1);
  }

  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('🍃 Connected to MongoDB Atlas successfully!\n');

    // 1. Migrate Users
    console.log('📦 Migrating Users...');
    const users = await dbAll('SELECT * FROM users');
    for (const u of users) {
      await User.findOneAndUpdate(
        { email: u.email.toLowerCase() },
        {
          id: u.id,
          name: u.name,
          email: u.email.toLowerCase(),
          password: u.password,
          role: u.role,
          plan: u.plan,
          generationsUsed: u.generationsUsed,
          freeLimit: u.freeLimit,
          status: u.status,
          joinedDate: u.joinedDate,
          avatar: u.avatar,
          provider: u.provider,
          picture: u.picture
        },
        { upsert: true, new: true }
      );
    }
    console.log(`✅ Migrated ${users.length} Users`);

    // 2. Migrate Pricing Plans
    console.log('📦 Migrating Pricing Plans...');
    const plans = await dbAll('SELECT * FROM pricing_plans');
    for (const p of plans) {
      let parsedFeatures = [];
      try {
        parsedFeatures = JSON.parse(p.features);
      } catch (e) {
        parsedFeatures = [p.features];
      }
      await PricingPlan.findOneAndUpdate(
        { id: p.id },
        {
          id: p.id,
          name: p.name,
          badge: p.badge,
          price: p.price,
          priceValue: p.priceValue,
          period: p.period,
          description: p.description,
          features: parsedFeatures,
          isPopular: Boolean(p.isPopular),
          isCurrent: Boolean(p.isCurrent),
          buttonText: p.buttonText,
          sortOrder: p.sortOrder
        },
        { upsert: true, new: true }
      );
    }
    console.log(`✅ Migrated ${plans.length} Pricing Plans`);

    // 3. Migrate Preset Templates
    console.log('📦 Migrating Preset Templates...');
    const presets = await dbAll('SELECT * FROM preset_templates');
    for (const pr of presets) {
      await PresetTemplate.findOneAndUpdate(
        { id: pr.id },
        {
          id: pr.id,
          title: pr.title,
          badge: pr.badge,
          inputType: pr.inputType,
          description: pr.description,
          sortOrder: pr.sortOrder
        },
        { upsert: true, new: true }
      );
    }
    console.log(`✅ Migrated ${presets.length} Preset Templates`);

    // 4. Migrate Test Suites
    console.log('📦 Migrating Test Suites...');
    const suites = await dbAll('SELECT * FROM test_suites');
    for (const s of suites) {
      await TestSuite.findOneAndUpdate(
        { id: s.id },
        {
          id: s.id,
          userId: s.userId,
          title: s.title,
          inputType: s.inputType,
          isLiveAI: Boolean(s.isLiveAI),
          testCasesCount: s.testCasesCount,
          createdAt: s.createdAt
        },
        { upsert: true, new: true }
      );
    }
    console.log(`✅ Migrated ${suites.length} Test Suites`);

    // 5. Migrate Test Cases
    console.log('📦 Migrating Test Cases...');
    const cases = await dbAll('SELECT * FROM test_cases');
    for (const c of cases) {
      let steps = [];
      try {
        steps = JSON.parse(c.steps);
      } catch (e) {
        steps = [c.steps];
      }
      await TestCase.findOneAndUpdate(
        { id: c.id },
        {
          id: c.id,
          suiteId: c.suiteId,
          scenario: c.scenario,
          steps,
          testData: c.testData,
          expectedResult: c.expectedResult,
          priority: c.priority,
          type: c.type,
          status: c.status,
          sortOrder: c.sortOrder
        },
        { upsert: true, new: true }
      );
    }
    console.log(`✅ Migrated ${cases.length} Test Cases`);

    // 6. Migrate Telemetry
    console.log('📦 Migrating Audit Telemetry...');
    const telemetry = await dbAll('SELECT * FROM audit_telemetry');
    for (const t of telemetry) {
      await AuditTelemetry.create({
        eventType: t.eventType,
        details: t.details,
        timestamp: t.timestamp
      });
    }
    console.log(`✅ Migrated ${telemetry.length} Telemetry Events`);

    console.log('\n======================================================');
    console.log('🎉 SUCCESS! ALL DATA MIGRATED TO CLOUD MONGODB ATLAS!');
    console.log('Your application is 100% cloud-ready for live deployment!');
    console.log('======================================================\n');
  } catch (err) {
    console.error('\n❌ Migration failed:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

runMigration();
