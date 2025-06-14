import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import authenticateUser from '../middleware/authentication.js';
import Booking from '../models/Booking.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Create a Stripe customer
router.post('/create-customer', async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ message: 'Email and name are required' });
    }

    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        userId: req.user?.userId || 'guest',
      },
    });

    console.log('Created customer:', customer.id);
    res.status(200).json({ customer });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ message: `Failed to create customer: ${error.message}` });
  }
});

// Create payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, customer, description, metadata } = req.body;

    if (!amount || !currency || !customer || !metadata?.customer_name || !metadata?.customer_email) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const paymentIntentData = {
  amount: Math.round(amount * 100),
  currency,
  customer,
  payment_method_types: ['card'],
  description: description || 'Airport transfer payment',
  metadata,
  receipt_email: metadata.customer_email,
  shipping: {
    name: metadata.customer_name || 'Test Customer',
    address: {
      line1: '123 Test Street',
      city: 'Mumbai',
      postal_code: '400001',
      country: 'IN',
      state: 'MH',
    },
  },
};

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ message: `Failed to create payment intent: ${error.message}` });
  }
});

// Webhook handler

// Webhook handler
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
 console.log("Start dfgdghdgdfg", req.body);
  console.log("Start endpointSecret", webhookSecret);

  let event;

  try {
    // Verify webhook signature using the raw body
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    console.log('Webhook signature verified successfully');
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await handleSuccessfulPayment(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        await handleFailedPayment(failedPayment);
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ message: 'Webhook handler failed' });
  }
});

async function handleSuccessfulPayment(paymentIntent) {
  try {
    const bookingId = paymentIntent.metadata.booking_id;
    if (!bookingId) {
      throw new Error('No booking ID found in payment intent metadata');
    }

    // Update booking status and payment status
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentId: paymentIntent.id
      },
      { new: true }
    );

    if (!updatedBooking) {
      throw new Error(`Booking not found with ID: ${bookingId}`);
    }

    console.log(`Successfully updated booking ${bookingId} after payment`);
    return updatedBooking;
  } catch (error) {
    console.error('Error handling successful payment:', error);
    throw error;
  }
}

async function handleFailedPayment(paymentIntent) {
  try {
    const bookingId = paymentIntent.metadata.booking_id;
    if (!bookingId) {
      throw new Error('No booking ID found in payment intent metadata');
    }

    // Update booking payment status to failed
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus: 'failed',
        status: 'pending'
      },
      { new: true }
    );

    if (!updatedBooking) {
      throw new Error(`Booking not found with ID: ${bookingId}`);
    }

    console.log(`Updated booking ${bookingId} after failed payment`);
    return updatedBooking;
  } catch (error) {
    console.error('Error handling failed payment:', error);
    throw error;
  }
}

export default router;
