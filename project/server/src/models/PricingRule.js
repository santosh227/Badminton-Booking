import mongoose from 'mongoose';
// PricingRule Schema
const pricingRuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['peak_hours', 'weekend', 'court_type', 'seasonal'],  // peak hours, weekend, court type, seasonal
    required: true
  },
  conditions: {
    // For peak_hours
    startTime: String, // "HH:MM"
    endTime: String,   // "HH:MM"
    
    // For weekend
    days: [Number], // [0,6] for Sunday, Saturday
    
    // For court_type
    courtType: String, // 'indoor', 'outdoor'
    
    // For seasonal
    startDate: Date,
    endDate: Date
  },
  multiplier: {
    type: Number,
    required: true,
    min: 0.1,
    max: 10
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});
// Exporting the PricingRule model
export default mongoose.model('PricingRule', pricingRuleSchema);