import axios from 'axios';
import { Vehicle } from '../types';

const API_URL = 'https://tajbookingservices.onrender.com/api/vehicles';


const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}; 

export const fetchVehicles = async (): Promise<Vehicle[]> => {
  const response = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to fetch vehicles');
  }

  return response.json();
};
export const fetchVehicleById = async (id: string): Promise<Vehicle> => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `Failed to fetch vehicle: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const createVehicle = async (vehicleData: Omit<Vehicle, '_id'>): Promise<Vehicle> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(vehicleData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `Failed to create vehicle: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const updateVehicle = async (id: string, vehicleData: Partial<Vehicle>): Promise<Vehicle> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(vehicleData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `Failed to update vehicle: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const deleteVehicle = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `Failed to delete vehicle: ${response.status} ${response.statusText}`);
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