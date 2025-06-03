import { Location } from '../types';

const API_URL = 'http://localhost:5000/api/locations';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const fetchLocations = async (): Promise<Location[]> => {
  const response = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to fetch locations');
  }
  return response.json();
};

export const createLocation = async (locationData: Omit<Location, '_id'>): Promise<Location> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(locationData),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `Failed to create location: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

export const updateLocation = async (id: string, locationData: Partial<Location>): Promise<Location> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(locationData),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `Failed to update location: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

export const deleteLocation = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `Failed to delete location: ${response.status} ${response.statusText}`);
  }
};