import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';

// Models
import Booking from './models/Booking.js';

// Routes
import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/bookings.js';
import routeRoutes from './routes/routes.js';
import vehicleRoutes from './routes/vehicles.js';
import locationRoutes from './routes/locations.js';
import adminRoutes from './routes/admin.js';
import stripeRoutes from './routes/stripe.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5000;

/* -------------------------------------------------------------
   Stripe Webhook – must be *before* body‑parsing middleware
------------------------------------------------------------- */
app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      console.log('✅ Webhook verified:', event.type);
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await handleSuccessfulPayment(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await handleFailedPayment(event.data.object);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
      res.json({ received: true });
    } catch (err) {
      console.error('❌ Webhook handler error:', err);
      res.status(500).json({ message: 'Webhook handler failed' });
    }
  }
);

/* -------------------------------------------------------------
   Global Middleware (after webhook route so it doesn't interfere)
------------------------------------------------------------- */
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* -------------------------------------------------------------
   REST API Routes
------------------------------------------------------------- */
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stripe', stripeRoutes);

/* -------------------------------------------------------------
   Static Files (Production)
------------------------------------------------------------- */
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

/* -------------------------------------------------------------
   MongoDB Connection
------------------------------------------------------------- */
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/airporttransfers', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

/* -------------------------------------------------------------
   Unhandled Promise Rejections
------------------------------------------------------------- */
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

/* -------------------------------------------------------------
   Helper Functions
------------------------------------------------------------- */
async function handleSuccessfulPayment(paymentIntent) {
  const bookingId = paymentIntent.metadata.booking_id;
  if (!bookingId) {
    throw new Error('No booking ID found in payment intent metadata');
  }

  const updatedBooking = await Booking.findByIdAndUpdate(
    bookingId,
    {
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentId: paymentIntent.id,
    },
    { new: true }
  );

  if (!updatedBooking) {
    throw new Error(`Booking not found with ID: ${bookingId}`);
  }

  console.log(`✅ Booking ${bookingId} marked as paid`);
}

async function handleFailedPayment(paymentIntent) {
  const bookingId = paymentIntent.metadata.booking_id;
  if (!bookingId) {
    throw new Error('No booking ID found in payment intent metadata');
  }

  const updatedBooking = await Booking.findByIdAndUpdate(
    bookingId,
    {
      status: 'pending',
      paymentStatus: 'failed',
    },
    { new: true }
  );

  if (!updatedBooking) {
    throw new Error(`Booking not found with ID: ${bookingId}`);
  }

  console.log(`⚠️ Booking ${bookingId} marked as failed`);
}
