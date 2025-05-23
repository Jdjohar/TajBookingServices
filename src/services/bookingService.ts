import { BookingFormData, Booking } from '../types';

const API_URL = 'https://tajbookingservices.onrender.com/api/bookings';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Request failed');
  }
  return response.json();
};

export const createBooking = async (bookingData: BookingFormData): Promise<Booking> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(bookingData),
  });
  return handleResponse(response);
};

export const getBookingById = async (id: string): Promise<Booking> => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const getAllBookings = async (): Promise<Booking[]> => {
  const response = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const updateBookingStatus = async (
  id: string,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
): Promise<Booking> => {
  const response = await fetch(`${API_URL}/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  return handleResponse(response);
};

export const assignDriver = async (id: string, driverName: string): Promise<Booking> => {
  const response = await fetch(`${API_URL}/${id}/assign-driver`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ driverName }),
  });
  return handleResponse(response);
};

export const cancelBooking = async (id: string, reason?: string): Promise<Booking> => {
  const response = await fetch(`${API_URL}/${id}/cancel`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ reason }),
  });
  return handleResponse(response);
};

// Mock data for development/testing
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