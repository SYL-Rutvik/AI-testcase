const mongoose = require('mongoose');

const testSuiteSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, default: null },
  title: { type: String, required: true },
  inputType: { type: String, default: 'User Story' },
  isLiveAI: { type: Boolean, default: false },
  testCasesCount: { type: Number, default: 0 },
  createdAt: { type: String, default: () => new Date().toISOString().slice(0, 10) }
}, {
  timestamps: true
});

module.exports = mongoose.models.TestSuite || mongoose.model('TestSuite', testSuiteSchema);
