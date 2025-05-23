import axios from 'axios';
import { Route, Location } from '../types';

const API_URL = 'https://tajbookingservices.onrender.com/api/routes';
const LOCATIONS_URL = 'https://tajbookingservices.onrender.com/api/locations';

export const fetchRoutes = async (): Promise<Route[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching routes:', error);
    throw error;
  }
};

export const fetchRouteById = async (id: string): Promise<Route> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching route ${id}:`, error);
    throw error;
  }
};

export const createRoute = async (routeData: Partial<Route>): Promise<Route> => {
  try {
    const response = await axios.post(API_URL, routeData);
    return response.data;
  } catch (error) {
    console.error('Error creating route:', error);
    throw error;
  }
};

export const updateRoute = async (id: string, routeData: Partial<Route>): Promise<Route> => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, routeData);
    return response.data;
  } catch (error) {
    console.error(`Error updating route ${id}:`, error);
    throw error;
  }
};

export const deleteRoute = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error(`Error deleting route ${id}:`, error);
    throw error;
  }
};

export const fetchLocations = async (): Promise<Location[]> => {
  try {
    const response = await axios.get(LOCATIONS_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};

export const createLocation = async (locationData: Partial<Location>): Promise<Location> => {
  try {
    const response = await axios.post(LOCATIONS_URL, locationData);
    return response.data;
  } catch (error) {
    console.error('Error creating location:', error);
    throw error;
  }
};

// For now, we'll mock these API calls by returning sample data
// This will be replaced with actual API calls when the backend is implemented
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