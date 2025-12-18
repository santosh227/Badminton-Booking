import mongoose from 'mongoose';
// Equipment Schema
const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['racket', 'shoes', 'other'],
    required: true
  },
  totalQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  availableQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  pricePerHour: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: String
}, {
  timestamps: true
});
// Exporting the Equipment model
export default mongoose.model('Equipment', equipmentSchema);