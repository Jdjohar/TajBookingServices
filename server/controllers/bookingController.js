import Booking from '../models/Booking.js';
import { sendEmail } from '../config/email.js';

export const createBooking = async (req, res) => {
  try {
    let booking = await Booking.create(req.body);

      console.log(booking,"booking");
      // Populate route and vehicle after creation
    booking = await Booking.findById(booking._id)
      .populate({
        path: 'route',
        populate: [
          { path: 'pickupLocation', select: 'name' },
          { path: 'dropoffLocation', select: 'name' }
        ]
      })
      .populate('vehicle');


    // Send confirmation email to customer
    if (booking.customer?.email) {
      const formattedDate = new Date(booking.pickupDate).toLocaleDateString();
      const emailHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Booking Confirmation</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f9f9f9;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .email-container {
              max-width: 600px;
              margin: 30px auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            }
            .header {
              background-color: #007BFF;
              color: #ffffff;
              padding: 20px;
              text-align: center;
            }
            .body {
              padding: 30px;
              line-height: 1.6;
            }
            .details {
              background-color: #f4f4f4;
              padding: 15px;
              margin: 20px 0;
              border-radius: 5px;
            }
            .footer {
              background-color: #f1f1f1;
              padding: 15px;
              text-align: center;
              font-size: 12px;
              color: #777;
            }
            .button {
              display: inline-block;
              margin-top: 20px;
              padding: 10px 20px;
              background-color: #007BFF;
              color: #fff;
              text-decoration: none;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h2>Booking Confirmed</h2>
            </div>
            <div class="body">
              <p>Hi ${booking.customer.name},</p>
              <p>Thank you for booking with <strong>Airport Transfers</strong>.</p>
              <p>Your booking has been successfully confirmed. Below are the details:</p>
              
              <div class="details">
                <p><strong>Booking ID:</strong> ${booking._id}</p>
                <p><strong>Pickup Date:</strong> ${formattedDate}</p>
                <p><strong>Pickup Time:</strong> ${booking.pickupTime}</p>
                <p><strong>Total Price:</strong> $${booking.totalPrice.toFixed(2)}</p>
                <p><strong>Status:</strong> ${booking.status}</p>
              </div>

              <p>If you have any questions, feel free to reply to this email.</p>
              <p>We look forward to providing you with a comfortable ride.</p>

              <p>Best regards,<br />The Airport Transfers Team</p>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} Airport Transfers. All rights reserved.
            </div>
          </div>
        </body>
        </html>
      `;

      await sendEmail({
        to: booking.customer.email,
        subject: 'Your Booking is Confirmed',
        html: emailHTML,
      });

      // Send notification to admin
await sendEmail({
  to: process.env.ADMIN_EMAIL || 'admin@example.com',
  subject: '🚗 New Booking Received',
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>New Booking Notification</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f7f7f7;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 30px auto;
          background-color: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        h2 {
          color: #007BFF;
          margin-bottom: 20px;
        }
        .info {
          background-color: #f2f2f2;
          padding: 20px;
          border-radius: 6px;
        }
        .info p {
          margin: 10px 0;
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
          color: #888;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>🚨 New Booking Received</h2>
        <p>A new booking has just been made. Details are below:</p>

        <div class="info">

        <p><strong>Booking ID:</strong> ${booking._id}</p>
        <p><strong>Name:</strong> ${booking.customer.name}</p>
        <p><strong>Email:</strong> ${booking.customer.email}</p>
        <p><strong>Phone:</strong> ${booking.customer.phone}</p>
        <p><strong>Pickup Date:</strong> ${new Date(booking.pickupDate).toLocaleDateString()}</p>
        <p><strong>Pickup Time:</strong> ${booking.pickupTime}</p>
        <p><strong>Route:</strong> ${booking.route?.pickupLocation?.name} → ${booking.route?.dropoffLocation?.name}</p>
        <p><strong>Vehicle:</strong> ${booking.vehicle?.name}</p>
        <p><strong>Total Price:</strong> $${booking.totalPrice}</p>
        <p><strong>Notes:</strong> $${booking.notes}</p>
        </div>

        <div class="footer">
          &copy; ${new Date().getFullYear()} Airport Transfers | Booking System
        </div>
      </div>
    </body>
    </html>
  `
});

    }

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
     .populate({
        path: 'route',
        populate: [
          { path: 'pickupLocation' },
          { path: 'dropoffLocation' }
        ]
      })
      .populate('vehicle')
      .populate('customer');
    
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