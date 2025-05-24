export interface Vehicle {
  _id: string;
  name: string;
  description: string;
  capacity: number;
  image: string;
}

export interface Location {
  _id: string;
  name: string;
  type: 'airport' | 'destination';
  address?: string;
}

export interface Route {
  _id: string;
  pickupLocation: Location;
  dropoffLocation: Location;
  distance: number;
  prices: {
    vehicleId: string;
    price: number;
  }[];
  active: boolean;
}

export interface Booking {
  _id: string;
  customer: Customer;
  route: Route;
  vehicle: Vehicle;
  pickupDate: string;
  pickupTime: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentId?: string;
  createdAt: string;
  notes?: string;
  driverAssigned?: string;
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  bookings?: Booking[];
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
}

export interface BookingFormData {
  routeId: string;
  pickupLocationId: string;
  dropoffLocationId: string;
  vehicleId: string;
  pickupDate: Date;
  pickupTime: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  totalPrice?: number;
  bookingId?: string;
  customerId?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}