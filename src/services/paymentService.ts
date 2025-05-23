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
        currency: 'inr',
        customer: customer.id,
        bookingId: bookingData.bookingId,
        description: `Airport transfer service - ${bookingData.name}`,
        statement_descriptor: 'AIRPORT TRANSFER',
        metadata: {
          booking_id: bookingData.bookingId,
          customer_name: bookingData.name,
          customer_email: bookingData.email,
          pickup_date: bookingData.pickupDate.toISOString(),
          pickup_time: bookingData.pickupTime,
        },
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
      body: JSON.stringify({
        customer: {
          name: bookingData.name,
          email: bookingData.email,
          phone: bookingData.phone,
        },
        route: bookingData.pickupLocationId,
        vehicle: bookingData.vehicleId,
        pickupDate: bookingData.pickupDate.toISOString().split('T')[0],
        pickupTime: bookingData.pickupTime,
        totalPrice: bookingData.totalPrice,
        notes: bookingData.notes || '',
        status: 'pending',
        paymentStatus: 'pending',
      }),
    });

    if (!bookingResponse.ok) {
      const errorData = await bookingResponse.json();
      throw new Error(errorData.message || 'Failed to create booking');
    }

    const booking = await bookingResponse.json();

    // Create payment intent
    const { clientSecret } = await createPaymentIntent({
      ...bookingData,
      bookingId: booking._id,
    });

    return {
      booking,
      clientSecret,
    };
  } catch (error) {
    console.error('Payment handling error:', error);
    throw error;
  }
};