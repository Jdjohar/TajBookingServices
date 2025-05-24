import Booking from '../models/Booking.js';
import { sendEmail } from '../config/email.js';

// Create new booking
export const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Error creating booking' });
  }
};

// Get single booking
export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('route')
      .populate('vehicle');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.status(200).json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Error fetching booking' });
  }
};

// Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('route')
      .populate('vehicle')
      .sort('-createdAt');
    
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('route vehicle');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // ✅ Send email to customer (nested under customer.email)
    if (booking.customer?.email) {
      await sendEmail({
        to: booking.customer.email,
        subject: 'Booking Status Updated',
        html: `
          <p>Dear ${booking.customer.name},</p>
          <p>Your booking status has been updated to: <strong>${status}</strong>.</p>
          <p>Booking ID: ${booking._id}</p>
          <p>Thank you,<br/>Airport Transfers Team</p>
        `,
      });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Error updating booking status' });
  }
};


// Assign driver to booking
export const assignDriver = async (req, res) => {
  try {
    const { driverName } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { driverAssigned: driverName },
      { new: true, runValidators: true }
    );
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.status(200).json(booking);
  } catch (error) {
    console.error('Assign driver error:', error);
    res.status(500).json({ message: 'Error assigning driver' });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'cancelled',
        cancellationReason: req.body.reason || 'No reason provided'
      },
      { new: true, runValidators: true }
    );
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.status(200).json(booking);
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Error cancelling booking' });
  }
};