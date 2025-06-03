// models/location.js
import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide location name'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['airport', 'destination'],
    required: [true, 'Please specify location type'],
  },
  address: {
    type: String,
    trim: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

// ✅ Composite unique index on name + type
LocationSchema.index({ name: 1, type: 1 }, { unique: true });

export default mongoose.model('Location', LocationSchema);
