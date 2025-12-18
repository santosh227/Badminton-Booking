import mongoose from 'mongoose';
// Booking Schema
const bookingSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  customerPhone: String,
  
  court: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Court',
    required: true
  },
  
  date: {
    type: Date,
    required: true
  },
  
  startTime: {
    type: String, //"HH:MM"
    required: true
  },
  
  endTime: {
    type: String, // "HH:MM"
    required: true
  },
  
  duration: {
    type: Number, // in hours
    required: true
  },
  
  equipment: [{
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment'
    },
    quantity: Number
  }],
  
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coach'
  },
  
  pricing: {
    courtPrice: Number,
    equipmentPrice: Number,
    coachPrice: Number,
    totalPrice: Number,
    appliedRules: [{
      ruleName: String,
      multiplier: Number
    }]
  },
  
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  
  notes: String
}, {
  // Add createdAt and updatedAt timestamps
  timestamps: true
});

// Compound index for efficient availability queries -- faster lookups
bookingSchema.index({ court: 1, date: 1, startTime: 1, endTime: 1 });
bookingSchema.index({ coach: 1, date: 1, startTime: 1, endTime: 1 });

// Exporting the Booking model
export default mongoose.model('Booking', bookingSchema);