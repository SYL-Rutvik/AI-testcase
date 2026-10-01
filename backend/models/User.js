const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  plan: { type: String, default: 'Free Tier' },
  generationsUsed: { type: Number, default: 0 },
  freeLimit: { type: Number, default: 10 },
  status: { type: String, enum: ['Active', 'Suspended'], default: 'Active' },
  joinedDate: { type: String, default: () => new Date().toISOString().slice(0, 10) },
  avatar: { type: String, default: 'US' },
  provider: { type: String, default: 'email' },
  picture: { type: String, default: null }
}, {
  timestamps: true
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
