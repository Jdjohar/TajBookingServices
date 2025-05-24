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

export const createCustomer = async (customerData: { email: string; name: string; id:string; }) => {
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
  console.log("start working 5", { bookingData });

  if (!bookingData.totalPrice || bookingData.totalPrice <= 0) {
    throw new Error("Invalid total price for payment intent");
  }

  try {
    // Use existing customer ID if available, otherwise create a new customer
    var customerId = bookingData.customerId;
    console.log(customerId,"customerId Csutomer ID");
    

    if (!customerId) {
      const customer = await createCustomer({
        email: bookingData.email,
        name: bookingData.name,
      });
      console.log("✅ Stripe customer created:", customer);

      if (!customer.customer || !customer.customer.id) {
        throw new Error("Failed to create Stripe customer or missing customer ID");
      }

      console.log(customerId,"2");
      
      customerId = customer.customer.id;
      console.log(customerId,"3");

    }

    if (!customerId) {
      throw new Error("Missing Stripe customer ID before creating payment intent");
    }

    const description = `Airport transfer service for ${bookingData.name} on ${bookingData.pickupDate.toISOString().split('T')[0]} at ${bookingData.pickupTime}`;
    console.log(customerId,"Generated description:", description);

    const requestBody = {
      amount: bookingData.totalPrice,
      currency: 'AUD',
      customer: customerId, // This should now be set properly
      bookingId: bookingData.bookingId,
      description,
      metadata: {
        booking_id: bookingData.bookingId,
        customer_name: bookingData.name,
        customer_email: bookingData.email,
        pickup_date: bookingData.pickupDate.toISOString(),
        pickup_time: bookingData.pickupTime,
      },
    };
    console.log("Request body for create-payment-intent:", requestBody);

    const response = await fetch(`${API_URL}/stripe/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log("start working 6", { responseStatus: response.status });
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from server:", errorData);
      throw new Error(errorData.message || 'Failed to create payment intent');
    }

    const result = await response.json();
    console.log("Payment intent creation response:", result);
    return result;

  } catch (error) {
    console.error('Payment intent creation error:', error);
    throw error;
  }
};



export const handlePayment = async (bookingData: BookingFormData) => {
  console.log("🟢 Starting handlePayment with data:", bookingData);

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
        route: bookingData.routeId,
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
    console.log("✅ Booking created:", booking);

    // Call createPaymentIntent
    console.log("📤 Calling createPaymentIntent with:", { ...bookingData, bookingId: booking._id });
    const { clientSecret } = await createPaymentIntent({
      ...bookingData,
      bookingId: booking._id,
    });

    console.log("✅ ClientSecret received:", clientSecret);

    return {
      booking,
      clientSecret,
    };

  } catch (error) {
    console.error('❌ Payment handling error:', error);
    throw error;
  }
};