import axios from 'axios';

const API_URL = 'https://tajbookingservices-i051.onrender.com/api/admin';

export const fetchDashboardStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/dashboard`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

export const fetchRevenueByPeriod = async (period: 'day' | 'week' | 'month' | 'year') => {
  try {
    const response = await axios.get(`${API_URL}/revenue?period=${period}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching revenue by ${period}:`, error);
    throw error;
  }
};

export const fetchTopRoutes = async (limit = 5) => {
  try {
    const response = await axios.get(`${API_URL}/top-routes?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching top routes:', error);
    throw error;
  }
};

export const fetchVehicleUtilization = async () => {
  try {
    const response = await axios.get(`${API_URL}/vehicle-utilization`);
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicle utilization:', error);
    throw error;
  }
};

export const fetchBookingsByStatus = async (status: string) => {
  try {
    const response = await axios.get(`${API_URL}/bookings?status=${status}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching bookings by status ${status}:`, error);
    throw error;
  }
};

export const fetchCustomerStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/customers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching customer stats:', error);
    throw error;
  }
};