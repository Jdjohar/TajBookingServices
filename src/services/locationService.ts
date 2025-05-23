import { Location } from '../types';

const API_URL = 'https://tajbookingservices.onrender.com/api/locations';

export const fetchLocations = async (): Promise<Location[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to fetch locations');
  }
  return response.json();
};

export const createLocation = async (locationData: Omit<Location, '_id'>): Promise<Location> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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
    headers: {
      'Content-Type': 'application/json',
    },
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
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `Failed to delete location: ${response.status} ${response.statusText}`);
  }
};