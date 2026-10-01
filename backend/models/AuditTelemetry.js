const mongoose = require('mongoose');

const auditTelemetrySchema = new mongoose.Schema({
  eventType: { type: String, required: true },
  details: { type: String, required: true },
  timestamp: { type: String, default: () => new Date().toISOString() }
}, {
  timestamps: true
});

module.exports = mongoose.models.AuditTelemetry || mongoose.model('AuditTelemetry', auditTelemetrySchema);
