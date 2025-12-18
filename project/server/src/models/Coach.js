import mongoose from 'mongoose';
// Coach Schema
const coachSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: String,
  hourlyRate: {
    type: Number,
    required: true
  },
  specialization: [{
    type: String
  }],
  availability: [{
    dayOfWeek: {
      type: Number, // 0-6 (Sunday-Saturday)
      required: true
    },
    startTime: {
      type: String, // "HH:MM"
      required: true
    },
    endTime: {
      type: String, // "HH:MM"
      required: true
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  bio: String
}, {
  timestamps: true
});
// Exporting the Coach model
export default mongoose.model('Coach', coachSchema);