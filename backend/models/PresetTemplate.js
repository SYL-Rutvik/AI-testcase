const mongoose = require('mongoose');

const presetTemplateSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  badge: { type: String, default: '' },
  inputType: { type: String, required: true },
  description: { type: String, required: true },
  sortOrder: { type: Number, default: 1 }
}, {
  timestamps: true
});

module.exports = mongoose.models.PresetTemplate || mongoose.model('PresetTemplate', presetTemplateSchema);
