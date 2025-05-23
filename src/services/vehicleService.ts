import axios from 'axios';
import { Vehicle } from '../types';

const API_URL = 'https://tajbookingservices.onrender.com/api/vehicles';

export const fetchVehicles = async (): Promise<Vehicle[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }
};

export const fetchVehicleById = async (id: string): Promise<Vehicle> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching vehicle ${id}:`, error);
    throw error;
  }
};

export const createVehicle = async (vehicleData: Partial<Vehicle>): Promise<Vehicle> => {
  try {
    const response = await axios.post(API_URL, vehicleData);
    return response.data;
  } catch (error) {
    console.error('Error creating vehicle:', error);
    throw error;
  }
};

export const updateVehicle = async (id: string, vehicleData: Partial<Vehicle>): Promise<Vehicle> => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, vehicleData);
    return response.data;
  } catch (error) {
    console.error(`Error updating vehicle ${id}:`, error);
    throw error;
  }
};

export const deleteVehicle = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error(`Error deleting vehicle ${id}:`, error);
    throw error;
  }
};

// For now, we'll mock these API calls by returning sample data
// This will be replaced with actual API calls when the backend is implemented
export const getMockVehicles = (): Promise<Vehicle[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          _id: '1',
          name: 'Premium Sedan',
          description: 'Comfortable sedan for up to 3 passengers with luggage',
          capacity: 3,
          image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        },
        {
          _id: '2',
          name: 'SUV',
          description: 'Spacious SUV for up to 5 passengers with luggage',
          capacity: 5,
          image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        },
        {
          _id: '3',
          name: 'Luxury Van',
          description: 'Luxury van for up to 7 passengers with luggage',
          capacity: 7,
          image: 'https://images.pexels.com/photos/9663327/pexels-photo-9663327.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        },
      ]);
    }, 300);
  });
};