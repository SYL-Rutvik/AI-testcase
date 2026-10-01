/**
 * Universal Database Service (Hybrid MongoDB Atlas & SQLite Repository)
 * 
 * Automatically routes database operations:
 * - To MongoDB Atlas when MONGODB_URI is provided and active.
 * - To local SQLite database when offline or MONGODB_URI is absent.
 */

const { isMongoActive, models } = require('./mongo');
const { dbGet, dbAll, dbRun } = require('./database');

const dbService = {
  // ==================== USER OPERATIONS ====================
  async findUserByEmail(email) {
    const normalized = email.trim().toLowerCase();
    if (isMongoActive()) {
      const doc = await models.User.findOne({ email: normalized }).lean();
      return doc;
    }
    return await dbGet('SELECT * FROM users WHERE LOWER(email) = ?', [normalized]);
  },

  async findUserById(id) {
    if (isMongoActive()) {
      const doc = await models.User.findOne({ id }).lean();
      return doc;
    }
    return await dbGet('SELECT * FROM users WHERE id = ?', [id]);
  },

  async createUser(userData) {
    if (isMongoActive()) {
      const created = await models.User.create(userData);
      return created.toObject();
    }
    await dbRun(`
      INSERT INTO users (id, name, email, password, role, plan, generationsUsed, freeLimit, status, joinedDate, avatar, provider, picture)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userData.id,
      userData.name,
      userData.email.toLowerCase(),
      userData.password || null,
      userData.role || 'user',
      userData.plan || 'Free Tier',
      userData.generationsUsed || 0,
      userData.freeLimit || 10,
      userData.status || 'Active',
      userData.joinedDate || new Date().toISOString().slice(0, 10),
      userData.avatar || 'US',
      userData.provider || 'email',
      userData.picture || null
    ]);
    return await dbGet('SELECT * FROM users WHERE id = ?', [userData.id]);
  },

  async updateUser(id, updates) {
    if (isMongoActive()) {
      const updated = await models.User.findOneAndUpdate({ id }, { $set: updates }, { new: true }).lean();
      return updated;
    }
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map(f => `${f} = ?`).join(', ');
    await dbRun(`UPDATE users SET ${setClause} WHERE id = ?`, [...values, id]);
    return await dbGet('SELECT * FROM users WHERE id = ?', [id]);
  },

  async deleteUser(id) {
    if (isMongoActive()) {
      const deleted = await models.User.findOneAndDelete({ id }).lean();
      return deleted;
    }
    const user = await dbGet('SELECT email FROM users WHERE id = ?', [id]);
    await dbRun('DELETE FROM users WHERE id = ?', [id]);
    return user;
  },

  async getAllUsers() {
    if (isMongoActive()) {
      return await models.User.find({}).sort({ joinedDate: -1 }).select('-password').lean();
    }
    return await dbAll(`
      SELECT id, name, email, role, plan, generationsUsed, freeLimit, status, joinedDate, avatar, provider
      FROM users 
      ORDER BY joinedDate DESC
    `);
  },

  // ==================== PRICING PLANS ====================
  async getPlans() {
    if (isMongoActive()) {
      const docs = await models.PricingPlan.find({}).sort({ sortOrder: 1 }).lean();
      return docs;
    }
    const plans = await dbAll('SELECT * FROM pricing_plans ORDER BY sortOrder ASC');
    return plans.map(p => {
      let features = [];
      try {
        features = JSON.parse(p.features);
      } catch (e) {
        features = [p.features];
      }
      return {
        ...p,
        features,
        isPopular: Boolean(p.isPopular),
        isCurrent: Boolean(p.isCurrent)
      };
    });
  },

  // ==================== PRESET TEMPLATES ====================
  async getPresets() {
    if (isMongoActive()) {
      return await models.PresetTemplate.find({}).sort({ sortOrder: 1 }).lean();
    }
    return await dbAll('SELECT * FROM preset_templates ORDER BY sortOrder ASC');
  },

  // ==================== TEST SUITES & TEST CASES ====================
  async getHistory() {
    if (isMongoActive()) {
      const suites = await models.TestSuite.find({}).sort({ createdAt: -1 }).lean();
      const result = [];
      for (const suite of suites) {
        const cases = await models.TestCase.find({ suiteId: suite.id }).sort({ sortOrder: 1 }).lean();
        result.push({
          id: suite.id,
          title: suite.title,
          inputType: suite.inputType,
          timestamp: suite.createdAt,
          isLiveAI: suite.isLiveAI,
          testCases: cases.map(c => ({
            id: c.id,
            scenario: c.scenario,
            steps: c.steps,
            testData: c.testData,
            expectedResult: c.expectedResult,
            priority: c.priority,
            type: c.type,
            status: c.status
          }))
        });
      }
      return result;
    }

    const suites = await dbAll('SELECT * FROM test_suites ORDER BY createdAt DESC');
    const result = [];
    for (const suite of suites) {
      const cases = await dbAll('SELECT * FROM test_cases WHERE suiteId = ? ORDER BY sortOrder ASC', [suite.id]);
      const parsedCases = cases.map(c => {
        let steps = [];
        try {
          steps = JSON.parse(c.steps);
        } catch (e) {
          steps = [c.steps];
        }
        return {
          id: c.id,
          scenario: c.scenario,
          steps,
          testData: c.testData,
          expectedResult: c.expectedResult,
          priority: c.priority,
          type: c.type,
          status: c.status
        };
      });
      result.push({
        id: suite.id,
        title: suite.title,
        inputType: suite.inputType,
        timestamp: suite.createdAt,
        isLiveAI: Boolean(suite.isLiveAI),
        testCases: parsedCases
      });
    }
    return result;
  },

  async saveTestSuite(suiteData, cases, userId = null) {
    if (isMongoActive()) {
      await models.TestSuite.create({
        id: suiteData.id,
        userId,
        title: suiteData.title,
        inputType: suiteData.inputType,
        isLiveAI: suiteData.isLiveAI,
        testCasesCount: cases.length,
        createdAt: suiteData.createdAt
      });

      const caseDocs = cases.map((tc, idx) => ({
        id: tc.id || `TC-${suiteData.id}-${idx + 1}`,
        suiteId: suiteData.id,
        scenario: tc.scenario || 'Test Scenario',
        steps: Array.isArray(tc.steps) ? tc.steps : [tc.steps],
        testData: tc.testData || '',
        expectedResult: tc.expectedResult || '',
        priority: tc.priority || 'High',
        type: tc.type || 'Positive',
        status: tc.status || 'Pending',
        sortOrder: idx + 1
      }));
      await models.TestCase.insertMany(caseDocs);

      if (userId) {
        await models.User.findOneAndUpdate({ id: userId }, { $inc: { generationsUsed: 1 } });
      }
      return;
    }

    await dbRun(`
      INSERT INTO test_suites (id, userId, title, inputType, isLiveAI, testCasesCount, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [suiteData.id, userId, suiteData.title, suiteData.inputType, suiteData.isLiveAI ? 1 : 0, cases.length, suiteData.createdAt]);

    for (let i = 0; i < cases.length; i++) {
      const tc = cases[i];
      const caseId = tc.id || `TC-${suiteData.id}-${i + 1}`;
      const stepsJson = JSON.stringify(Array.isArray(tc.steps) ? tc.steps : [tc.steps]);

      await dbRun(`
        INSERT INTO test_cases (id, suiteId, scenario, steps, testData, expectedResult, priority, type, status, sortOrder)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        caseId,
        suiteData.id,
        tc.scenario || 'Test Scenario',
        stepsJson,
        tc.testData || '',
        tc.expectedResult || '',
        tc.priority || 'High',
        tc.type || 'Positive',
        tc.status || 'Pending',
        i + 1
      ]);
    }

    if (userId) {
      await dbRun('UPDATE users SET generationsUsed = generationsUsed + 1 WHERE id = ?', [userId]);
    }
  },

  async deleteTestSuite(suiteId) {
    if (isMongoActive()) {
      await models.TestCase.deleteMany({ suiteId });
      await models.TestSuite.deleteOne({ id: suiteId });
      return;
    }
    await dbRun('DELETE FROM test_cases WHERE suiteId = ?', [suiteId]);
    await dbRun('DELETE FROM test_suites WHERE id = ?', [suiteId]);
  },

  async getInitialTestCases() {
    if (isMongoActive()) {
      const firstSuite = await models.TestSuite.findOne({}).sort({ createdAt: -1 }).lean();
      if (!firstSuite) return { suiteId: null, testCases: [] };
      const cases = await models.TestCase.find({ suiteId: firstSuite.id }).sort({ sortOrder: 1 }).lean();
      return {
        suiteId: firstSuite.id,
        testCases: cases.map(c => ({
          id: c.id,
          scenario: c.scenario,
          steps: c.steps,
          testData: c.testData,
          expectedResult: c.expectedResult,
          priority: c.priority,
          type: c.type,
          status: c.status
        }))
      };
    }

    const firstSuite = await dbGet('SELECT id FROM test_suites ORDER BY createdAt DESC LIMIT 1');
    if (!firstSuite) return { suiteId: null, testCases: [] };

    const cases = await dbAll('SELECT * FROM test_cases WHERE suiteId = ? ORDER BY sortOrder ASC', [firstSuite.id]);
    const parsedCases = cases.map(c => {
      let steps = [];
      try {
        steps = JSON.parse(c.steps);
      } catch (e) {
        steps = [c.steps];
      }
      return {
        id: c.id,
        scenario: c.scenario,
        steps,
        testData: c.testData,
        expectedResult: c.expectedResult,
        priority: c.priority,
        type: c.type,
        status: c.status
      };
    });

    return {
      suiteId: firstSuite.id,
      testCases: parsedCases
    };
  },

  // ==================== AUDIT TELEMETRY ====================
  async logTelemetry(eventType, details) {
    const timestamp = new Date().toISOString();
    if (isMongoActive()) {
      try {
        await models.AuditTelemetry.create({ eventType, details, timestamp });
      } catch (e) {
        console.warn('Telemetry log error:', e.message);
      }
      return;
    }
    try {
      await dbRun(`
        INSERT INTO audit_telemetry (eventType, details, timestamp)
        VALUES (?, ?, ?)
      `, [eventType, details, timestamp]);
    } catch (e) {
      console.warn('Telemetry log error:', e.message);
    }
  },

  async getTelemetry() {
    if (isMongoActive()) {
      const totalUsers = await models.User.countDocuments();
      const activeUsers = await models.User.countDocuments({ status: 'Active' });
      const proUsers = await models.User.countDocuments({ plan: { $in: ['Pro', 'Enterprise'] } });
      const freeUsers = await models.User.countDocuments({ plan: 'Free Tier' });
      const totalSuites = await models.TestSuite.countDocuments();
      const totalCases = await models.TestCase.countDocuments();
      const recentAudit = await models.AuditTelemetry.find({}).sort({ createdAt: -1 }).limit(5).lean();

      return {
        totalUsers,
        activeUsers,
        proUsers,
        freeUsers,
        totalSuites,
        totalCases,
        recentAudit,
        dbEngine: 'Cloud MongoDB Atlas'
      };
    }

    const totalUsersRow = await dbGet('SELECT COUNT(*) as count FROM users');
    const activeUsersRow = await dbGet("SELECT COUNT(*) as count FROM users WHERE status = 'Active'");
    const proUsersRow = await dbGet("SELECT COUNT(*) as count FROM users WHERE plan IN ('Pro', 'Enterprise')");
    const freeUsersRow = await dbGet("SELECT COUNT(*) as count FROM users WHERE plan = 'Free Tier'");
    const suitesRow = await dbGet('SELECT COUNT(*) as count FROM test_suites');
    const casesRow = await dbGet('SELECT COUNT(*) as count FROM test_cases');
    const recentAudit = await dbAll('SELECT * FROM audit_telemetry ORDER BY id DESC LIMIT 5');

    return {
      totalUsers: totalUsersRow ? totalUsersRow.count : 0,
      activeUsers: activeUsersRow ? activeUsersRow.count : 0,
      proUsers: proUsersRow ? proUsersRow.count : 0,
      freeUsers: freeUsersRow ? freeUsersRow.count : 0,
      totalSuites: suitesRow ? suitesRow.count : 0,
      totalCases: casesRow ? casesRow.count : 0,
      recentAudit,
      dbEngine: 'Local SQLite (Ready for Cloud MongoDB Migration)'
    };
  }
};

module.exports = dbService;
