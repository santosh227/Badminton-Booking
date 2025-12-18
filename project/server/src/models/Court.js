import mongoose from 'mongoose';
//
// Court Schema
const courtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['indoor', 'outdoor'],
    required: true
  },
  basePrice: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  amenities: [{
    type: String
  }]
}, {
  timestamps: true
});
// Exporting the Court model
export default mongoose.model('Court', courtSchema);