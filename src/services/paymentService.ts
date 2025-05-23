import { loadStripe } from '@stripe/stripe-js';
import { BookingFormData } from '../types';

const API_URL = 'https://tajbookingservices.onrender.com/api';
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

let stripePromise: Promise<any> | null = null;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
  }
  return stripePromise;
};

export const createCustomer = async (customerData: { email: string; name: string }) => {
  try {
    const response = await fetch(`${API_URL}/stripe/create-customer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create customer');
    }

    return await response.json();
  } catch (error) {
    console.error('Customer creation error:', error);
    throw error;
  }
};

export const createPaymentIntent = async (bookingData: BookingFormData) => {
  try {
    // Create customer first
    const customer = await createCustomer({
      email: bookingData.email,
      name: bookingData.name,
    });

    const response = await fetch(`${API_URL}/stripe/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: bookingData.totalPrice,
        currency: 'usd',
        customer: customer.id,
        bookingId: bookingData.bookingId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create payment intent');
    }

    return await response.json();
  } catch (error) {
    console.error('Payment intent creation error:', error);
    throw error;
  }
};

export const handlePayment = async (bookingData: BookingFormData) => {
  try {
    // Create booking first
    const bookingResponse = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    if (!bookingResponse.ok) {
      const errorData = await bookingResponse.json();
      throw new Error(errorData.message || 'Failed to create booking');
    }

    const booking = await bookingResponse.json();

    // Create payment intent with customer
    const { clientSecret } = await createPaymentIntent({
      ...bookingData,
      bookingId: booking._id,
    });

    // Load Stripe
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    // Confirm payment
    const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: {
          number: '4242424242424242', // Test card number
          exp_month: 12,
          exp_year: 2024,
          cvc: '123',
        },
      },
    });

    if (paymentError) {
      throw new Error(paymentError.message);
    }

    // Update booking with payment information
    const updateResponse = await fetch(`${API_URL}/bookings/${booking._id}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentIntentId: paymentIntent.id,
        paymentStatus: paymentIntent.status,
      }),
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      throw new Error(errorData.message || 'Failed to update booking payment status');
    }

    return {
      booking: await updateResponse.json(),
      paymentIntent,
    };
  } catch (error) {
    console.error('Payment handling error:', error);
    throw error;
  }
};