// routeServices.ts

import { Route, Location } from '../types';

const API_URL = 'https://tajbookingservices.onrender.com/api/routes';
const LOCATIONS_URL = 'https://tajbookingservices.onrender.com/api/locations';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// ROUTES
export const fetchRoutes = async (): Promise<Route[]> => {
  const response = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to fetch routes');
  }
  return response.json();
};

export const fetchRouteById = async (id: string): Promise<Route> => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `Failed to fetch route ${id}`);
  }
  return response.json();
};

export const createRoute = async (routeData: Omit<Route, '_id'>): Promise<Route> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(routeData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to create route');
  }
  return response.json();
};

export const updateRoute = async (id: string, routeData: Partial<Route>): Promise<Route> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(routeData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `Failed to update route ${id}`);
  }
  return response.json();
};

export const deleteRoute = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `Failed to delete route ${id}`);
  }
};

// LOCATIONS
export const fetchLocations = async (): Promise<Location[]> => {
  const response = await fetch(LOCATIONS_URL, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to fetch locations');
  }
  return response.json();
};

export const createLocation = async (locationData: Omit<Location, '_id'>): Promise<Location> => {
  const response = await fetch(LOCATIONS_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(locationData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to create location');
  }
  return response.json();
};

// MOCKS
export const getMockLocations = (): Promise<Location[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { _id: '1', name: 'JFK Airport', type: 'airport' },
        { _id: '2', name: 'LaGuardia Airport', type: 'airport' },
        { _id: '3', name: 'Newark Airport', type: 'airport' },
        { _id: '4', name: 'Manhattan', type: 'destination', address: 'New York, NY' },
        { _id: '5', name: 'Brooklyn', type: 'destination', address: 'Brooklyn, NY' },
        { _id: '6', name: 'Queens', type: 'destination', address: 'Queens, NY' },
      ]);
    }, 300);
  });
};

export const getMockRoutes = (): Promise<Route[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          _id: '1',
          pickupLocation: { _id: '1', name: 'JFK Airport', type: 'airport' },
          dropoffLocation: { _id: '4', name: 'Manhattan', type: 'destination', address: 'New York, NY' },
          distance: 20,
          prices: [
            { vehicleId: '1', price: 79 },
            { vehicleId: '2', price: 95 },
            { vehicleId: '3', price: 120 },
          ],
          active: true,
        },
        {
          _id: '2',
          pickupLocation: { _id: '1', name: 'JFK Airport', type: 'airport' },
          dropoffLocation: { _id: '5', name: 'Brooklyn', type: 'destination', address: 'Brooklyn, NY' },
          distance: 15,
          prices: [
            { vehicleId: '1', price: 69 },
            { vehicleId: '2', price: 85 },
            { vehicleId: '3', price: 110 },
          ],
          active: true,
        },
        {
          _id: '3',
          pickupLocation: { _id: '2', name: 'LaGuardia Airport', type: 'airport' },
          dropoffLocation: { _id: '4', name: 'Manhattan', type: 'destination', address: 'New York, NY' },
          distance: 10,
          prices: [
            { vehicleId: '1', price: 65 },
            { vehicleId: '2', price: 80 },
            { vehicleId: '3', price: 105 },
          ],
          active: true,
        },
      ]);
    }, 300);
  });
};
