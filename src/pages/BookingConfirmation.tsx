import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, Car, User, Clock } from 'lucide-react';
import { Booking } from '../types';
import { getBookingById } from '../services/bookingService';
import { fetchLocations } from '../services/locationService';

const BookingConfirmation = () => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
const [locationsMap, setLocationsMap] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const loadBooking = async () => {
      try {
        if (id) {

          
          console.log(id, "Booking ID");
          const data = await getBookingById(id);
          console.log(data, "Booking ID");
          
          setBooking(data);
        }
      } catch (error) {
        console.error('Error loading booking:', error);
      } finally {
        setIsLoading(false);
      }
    };
      const loadLocations = async () => {
        try {
          const locations = await fetchLocations();
          console.log(locations,"sddssddsdsdsdsdsdssd");
          
          const map: { [key: string]: string } = {};
          locations.forEach((loc: any) => {
            map[loc._id] = loc.name;
          });
    
          console.log(map,"sdsddsds");
          
          setLocationsMap(map);
        } catch (error) {
          console.error('Error loading locations:', error);
          toast.error('Failed to load locations');
        }
      };

    loadBooking();
     loadLocations();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-4 border-t-4 border-primary-500"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Booking Not Found</h2>
        <p className="mb-6 text-gray-600">The booking you're looking for doesn't exist or has been removed.</p>
        <Link
          to="/booking"
          className="rounded-full bg-primary-500 px-6 py-3 font-medium text-white transition-colors hover:bg-primary-600"
        >
          Make a New Booking
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-500">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="mb-2 font-heading text-3xl font-bold text-gray-900">Booking Confirmed!</h1>
            <p className="text-lg text-gray-600">
              Your booking has been confirmed and is ready for your journey.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl bg-white shadow-lg">
            <div className="border-b border-gray-200 bg-primary-50 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Booking Reference</p>
                  <p className="text-lg font-semibold text-gray-900">#{booking._id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-primary-500">${booking.totalPrice}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 font-heading text-lg font-semibold text-gray-900">Journey Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-primary-500" />
                      <div>

                        {console.log(booking, "ds")}
                        <p className="font-medium text-gray-900">Pickup Location</p>
                        <p className="text-gray-600">{locationsMap[booking.route.pickupLocation] || 'Unknown'}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-primary-500" />
                      <div>
                        <p className="font-medium text-gray-900">Drop-off Location</p>
                        <p className="text-gray-600">{locationsMap[booking.route.dropoffLocation] || 'Unknown'}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Calendar className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-primary-500" />
                      <div>
                        <p className="font-medium text-gray-900">Date</p>
                        <p className="text-gray-600">{booking.pickupDate}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-primary-500" />
                      <div>
                        <p className="font-medium text-gray-900">Time</p>
                        <p className="text-gray-600">{booking.pickupTime}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 font-heading text-lg font-semibold text-gray-900">Vehicle & Contact</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Car className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-primary-500" />
                      <div>
                        <p className="font-medium text-gray-900">Vehicle Type</p>
                        <p className="text-gray-600">{booking.vehicle.name}</p>
                        <p className="text-sm text-gray-500">{booking.vehicle.description}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <User className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-primary-500" />
                      <div>
                        <p className="font-medium text-gray-900">Passenger Details</p>
                        <p className="text-gray-600">{booking.customer.name}</p>
                        <p className="text-gray-600">{booking.customer.email}</p>
                        <p className="text-gray-600">{booking.customer.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {booking.notes && (
                <div className="mt-6 rounded-lg bg-gray-50 p-4">
                  <p className="font-medium text-gray-900">Additional Notes</p>
                  <p className="text-gray-600">{booking.notes}</p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 bg-gray-50 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <Link
                    to="/booking"
                    className="rounded-full bg-primary-500 px-6 py-3 font-medium text-white transition-colors hover:bg-primary-600"
                  >
                    Book Another Transfer
                  </Link>
                </div>
                <button
                  onClick={() => window.print()}
                  className="rounded-full border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Print Confirmation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;