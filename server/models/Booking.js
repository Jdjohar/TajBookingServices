import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  customer: {
    name: {
      type: String,
      required: [true, 'Please provide customer name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide customer email'],
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        'Please provide a valid email',
      ],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide customer phone number'],
      trim: true,
    },
  },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: [true, 'Please provide a route'],
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'Please provide a vehicle'],
  },
  pickupDate: {
    type: Date,
    required: [true, 'Please provide pickup date'],
  },
  pickupTime: {
    type: String,
    required: [true, 'Please provide pickup time'],
  },
  totalPrice: {
    type: Number,
    required: [true, 'Please provide total price'],
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending',
  },
  paymentId: {
    type: String,
  },
  notes: {
    type: String,
    trim: true,
  },
  driverAssigned: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure pickup date is at least 2 days in the future
BookingSchema.pre('save', function(next) {
  const minBookingDate = new Date();
  minBookingDate.setDate(minBookingDate.getDate() + 2);
  minBookingDate.setHours(0, 0, 0, 0);
  
  const pickupDate = new Date(this.pickupDate);
  pickupDate.setHours(0, 0, 0, 0);
  
  if (pickupDate < minBookingDate) {
    const error = new Error('Pickup date must be at least 2 days in the future');
    return next(error);
  }
  
  next();
});

// Create index for efficient queries
BookingSchema.index({ pickupDate: 1, status: 1 });
BookingSchema.index({ 'customer.email': 1 });

export default mongoose.model('Booking', BookingSchema);