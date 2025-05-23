import axios from 'axios';
import { BookingFormData, Booking } from '../types';

const API_URL = 'https://tajbookingservices.onrender.com/api/bookings';

export const createBooking = async (bookingData: BookingFormData): Promise<Booking> => {
  try {
    const response = await axios.post(API_URL, bookingData);
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const getBookingById = async (id: string): Promise<Booking> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching booking ${id}:`, error);
    throw error;
  }
};

export const getAllBookings = async (): Promise<Booking[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    throw error;
  }
};

export const updateBookingStatus = async (
  id: string,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
): Promise<Booking> => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating booking ${id} status:`, error);
    throw error;
  }
};

export const assignDriver = async (id: string, driverName: string): Promise<Booking> => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/assign-driver`, { driverName });
    return response.data;
  } catch (error) {
    console.error(`Error assigning driver to booking ${id}:`, error);
    throw error;
  }
};

export const cancelBooking = async (id: string, reason?: string): Promise<Booking> => {
  try {
    const response = await axios.post(`${API_URL}/${id}/cancel`, { reason });
    return response.data;
  } catch (error) {
    console.error(`Error cancelling booking ${id}:`, error);
    throw error;
  }
};

// For now, we'll mock these API calls by returning sample data
// This will be replaced with actual API calls when the backend is implemented
export const getMockBooking = (id: string): Promise<Booking> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        _id: id,
        customer: {
          _id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
        },
        route: {
          _id: '1',
          pickupLocation: {
            _id: '1',
            name: 'JFK Airport',
            type: 'airport',
          },
          dropoffLocation: {
            _id: '2',
            name: 'Manhattan',
            type: 'destination',
          },
          distance: 20,
          prices: [
            {
              vehicleId: '1',
              price: 79,
            },
          ],
          active: true,
        },
        vehicle: {
          _id: '1',
          name: 'Premium Sedan',
          description: 'Comfortable sedan for up to 3 passengers',
          capacity: 3,
          image: 'https://via.placeholder.com/150',
        },
        pickupDate: '2023-11-25',
        pickupTime: '14:30',
        totalPrice: 79,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentId: 'pi_123456789',
        createdAt: '2023-11-20T10:30:00Z',
        notes: 'Flight AA123, arriving at Terminal 4',
      });
    }, 500);
  });
};