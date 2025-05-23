import mongoose from 'mongoose';

const RouteSchema = new mongoose.Schema({
  pickupLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: [true, 'Please provide pickup location'],
  },
  dropoffLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: [true, 'Please provide dropoff location'],
  },
  distance: {
    type: Number,
    required: [true, 'Please provide distance in miles'],
  },
  prices: [
    {
      vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: [true, 'Please provide vehicle ID'],
      },
      price: {
        type: Number,
        required: [true, 'Please provide price for this vehicle type'],
      },
    },
  ],
  active: {
    type: Boolean,
    default: true,
  },
});

// Compound index to ensure uniqueness of pickup/dropoff location pairs
RouteSchema.index({ pickupLocation: 1, dropoffLocation: 1 }, { unique: true });

export default mongoose.model('Route', RouteSchema);