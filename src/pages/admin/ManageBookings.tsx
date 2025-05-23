import { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Clock, MapPin, Car, User, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { Booking } from '../../types';
import { getAllBookings, updateBookingStatus, assignDriver } from '../../services/bookingService';

const ManageBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await getAllBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
    try {
      const updatedBooking = await updateBookingStatus(id, status);
      setBookings(bookings.map(booking => booking._id === id ? updatedBooking : booking));
      toast.success(`Booking status updated to ${status}`);
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };

  const handleAssignDriver = async (id: string, driverName: string) => {
    try {
      const updatedBooking = await assignDriver(id, driverName);
      setBookings(bookings.map(booking => booking._id === id ? updatedBooking : booking));
      toast.success('Driver assigned successfully');
    } catch (error) {
      console.error('Error assigning driver:', error);
      toast.error('Failed to assign driver');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking._id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    let matchesDate = true;
    if (dateFilter === 'today') {
      matchesDate = new Date(booking.pickupDate).toDateString() === new Date().toDateString();
    } else if (dateFilter === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      matchesDate = new Date(booking.pickupDate).toDateString() === tomorrow.toDateString();
    } else if (dateFilter === 'week') {
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      matchesDate = new Date(booking.pickupDate) <= weekFromNow;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-4 border-t-4 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-gray-900 md:text-3xl">Manage Bookings</h1>

      <div className="mb-6 space-y-4 rounded-lg bg-white p-4 shadow-md md:flex md:items-center md:space-x-4 md:space-y-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        <div className="flex space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="week">Next 7 Days</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <div
            key={booking._id}
            className="overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-[1.02]"
          >
            <div className="border-b border-gray-200 bg-gray-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Booking Reference</p>
                  <p className="text-lg font-semibold text-gray-900">#{booking._id}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      booking.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : booking.status === 'confirmed'
                        ? 'bg-blue-100 text-blue-800'
                        : booking.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-600">Amount</p>
                    <p className="text-lg font-semibold text-primary-500">${booking.totalPrice}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <User className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-primary-500" />
                    <div>
                      <p className="font-medium text-gray-900">{booking.customer.name}</p>
                      <p className="text-sm text-gray-600">{booking.customer.email}</p>
                      <p className="text-sm text-gray-600">{booking.customer.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-primary-500" />
                    <div>
                      <p className="font-medium text-gray-900">Route</p>
                      <p className="text-sm text-gray-600">
                        From: {booking.route.pickupLocation.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        To: {booking.route.dropoffLocation.name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-primary-500" />
                    <div>
                      <p className="font-medium text-gray-900">Pickup Date & Time</p>
                      <p className="text-sm text-gray-600">{booking.pickupDate}</p>
                      <p className="text-sm text-gray-600">{booking.pickupTime}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Car className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-primary-500" />
                    <div>
                      <p className="font-medium text-gray-900">Vehicle</p>
                      <p className="text-sm text-gray-600">{booking.vehicle.name}</p>
                      <p className="text-xs text-gray-500">{booking.vehicle.description}</p>
                    </div>
                  </div>
                </div>
              </div>

              {booking.notes && (
                <div className="mt-4 rounded-lg bg-gray-50 p-4">
                  <p className="text-sm font-medium text-gray-900">Additional Notes</p>
                  <p className="text-sm text-gray-600">{booking.notes}</p>
                </div>
              )}

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                    disabled={booking.status === 'confirmed'}
                    className="flex items-center rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600 disabled:bg-gray-300"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Confirm
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(booking._id, 'completed')}
                    disabled={booking.status === 'completed'}
                    className="flex items-center rounded-lg bg-success-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-success-600 disabled:bg-gray-300"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Complete
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                    disabled={booking.status === 'cancelled'}
                    className="flex items-center rounded-lg bg-danger-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-danger-600 disabled:bg-gray-300"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel
                  </button>
                </div>

                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Booked on {new Date(booking.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageBookings;