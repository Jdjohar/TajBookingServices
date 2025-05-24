import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide location name'],
    trim: true,
    unique: true,
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

export default mongoose.model('Location', LocationSchema);