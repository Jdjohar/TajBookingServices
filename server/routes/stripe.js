import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import authenticateUser from '../middleware/authentication.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

/**
 * POST /api/stripe/create-customer
 */
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

/**
 * POST /api/stripe/create-payment-intent
 */
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, customer, description, metadata } = req.body;

    if (!amount || !currency || !customer || !metadata?.customer_name || !metadata?.customer_email || !metadata?.booking_id) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const paymentIntentData = {
      amount: Math.round(amount * 100), // convert to the smallest unit
      currency,
      customer,
      payment_method_types: ['card'],
      description: description || 'Airport transfer payment',
      metadata,
      receipt_email: metadata.customer_email,
      shipping: {
        name: metadata.customer_name,
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

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ message: `Failed to create payment intent: ${error.message}` });
  }
});

export default router;