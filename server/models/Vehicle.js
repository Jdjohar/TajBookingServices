import mongoose from 'mongoose';

const VehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide vehicle name'],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide vehicle description'],
    trim: true,
  },
  capacity: {
    type: Number,
    required: [true, 'Please provide passenger capacity'],
    min: [1, 'Capacity must be at least 1'],
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/150',
  },
  active: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model('Vehicle', VehicleSchema);