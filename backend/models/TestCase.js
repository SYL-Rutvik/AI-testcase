const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  suiteId: { type: String, required: true, index: true },
  scenario: { type: String, required: true },
  steps: { type: [String], default: [] },
  testData: { type: String, default: '' },
  expectedResult: { type: String, default: '' },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'High' },
  type: { type: String, enum: ['Positive', 'Negative', 'Boundary'], default: 'Positive' },
  status: { type: String, default: 'Pending' },
  sortOrder: { type: Number, default: 1 }
}, {
  timestamps: true
});

module.exports = mongoose.models.TestCase || mongoose.model('TestCase', testCaseSchema);
