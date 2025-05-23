import { BookingFormData, Booking } from '../types';

const API_URL = '/api/bookings';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    try {
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Request failed with status: ${response.status}`);
      }
      const textError = await response.text();
      console.error('Server response:', textError); // Log the actual response for debugging
      throw new Error(`Invalid server response. Status: ${response.status}`);
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error(`Request failed with status: ${response.status}`);
    }
  }
  
  try {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    const textResponse = await response.text();
    console.error('Unexpected response format:', textResponse); // Log non-JSON responses
    throw new Error('Invalid response format from server');
  } catch (error) {
    console.error('Response parsing error:', error);
    throw new Error('Failed to parse server response');
  }
};

export const createBooking = async (bookingData: BookingFormData): Promise<Booking> => {
  try {
    // Validate required fields before making the request
    const requiredFields = ['pickupLocationId', 'dropoffLocationId', 'pickupDate', 'pickupTime', 'vehicleId', 'name', 'email', 'phone'];
    const missingFields = requiredFields.filter(field => !bookingData[field as keyof BookingFormData]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Format the date to ensure it's in the correct format
    const formattedData = {
      ...bookingData,
      pickupDate: new Date(bookingData.pickupDate).toISOString().split('T')[0],
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Booking creation error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to create booking: Unknown error occurred');
  }
};

// For authenticated endpoints, we'll use the auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication token not found');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
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