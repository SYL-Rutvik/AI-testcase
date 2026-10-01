const mongoose = require('mongoose');

const pricingPlanSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  badge: { type: String, default: '' },
  price: { type: String, required: true },
  priceValue: { type: Number, default: 0 },
  period: { type: String, default: 'month' },
  description: { type: String, default: '' },
  features: { type: [String], default: [] },
  isPopular: { type: Boolean, default: false },
  isCurrent: { type: Boolean, default: false },
  buttonText: { type: String, default: 'Choose Plan' },
  sortOrder: { type: Number, default: 1 }
}, {
  timestamps: true
});

module.exports = mongoose.models.PricingPlan || mongoose.model('PricingPlan', pricingPlanSchema);
