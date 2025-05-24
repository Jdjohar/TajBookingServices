import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import authenticateUser from '../middleware/authentication.js';

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
    console.log(amount, currency, customer, description,"sdsddssddsddsds ===============");
    
    if (!amount || !currency || !customer) {
      return res.status(400).json({ message: 'Missing required fields: amount, currency, or customer' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      customer,
      payment_method_types: ['card'],
      description: description || 'Airport transfer payment',
      // statement_descriptor: statement_descriptor || 'AIRPORT TRANSFER',
      metadata: metadata || { bookingId: req.body.bookingId || 'unknown' },
    });
    console.log('✅ Created Payment Intent:', paymentIntent);
    console.log('Created Payment Intent:', paymentIntent.id, 'Client Secret:', paymentIntent.client_secret);
    
    if (!paymentIntent.client_secret) {
      throw new Error("Missing client_secret in Stripe response");
    }


    
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ message: `Failed to create payment intent: ${error.message}` });
  }
});

// Webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        // Update booking status
        await handleSuccessfulPayment(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        // Handle failed payment
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
  const bookingId = paymentIntent.metadata.bookingId;
  // Update booking status in your database
  // This is where you would update the booking status to 'confirmed'
}

async function handleFailedPayment(paymentIntent) {
  const bookingId = paymentIntent.metadata.bookingId;
  // Update booking status in your database
  // This is where you would update the booking status to 'payment_failed'
}

export default router;