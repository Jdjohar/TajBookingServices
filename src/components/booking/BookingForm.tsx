import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { addDays, format, isAfter } from 'date-fns';
import { toast } from 'react-toastify';
import { Calendar, Clock, MapPin, Car, User, Mail, Phone, FileText } from 'lucide-react';
import { BookingFormData, Route, Vehicle, Location } from '../../types';
import { createBooking } from '../../services/bookingService';
import { fetchLocations, fetchRoutes } from '../../services/routeService';
import { fetchVehicles } from '../../services/vehicleService';

const BookingForm = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [pickupLocations, setPickupLocations] = useState<Location[]>([]);
  const [dropoffLocations, setDropoffLocations] = useState<Location[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    defaultValues: {
      pickupDate: addDays(new Date(), 2),
      pickupTime: '12:00',
    },
  });

  const pickupLocationId = watch('pickupLocationId');
  const dropoffLocationId = watch('dropoffLocationId');
  const vehicleId = watch('vehicleId');
  const minDate = addDays(new Date(), 2); // Minimum 2 days in advance

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [locationsData, routesData, vehiclesData] = await Promise.all([
          fetchLocations(),
          fetchRoutes(),
          fetchVehicles(),
        ]);

        setLocations(locationsData);
        setRoutes(routesData);
        setVehicles(vehiclesData);

        // Filter pickup locations (airports)
        const pickups = locationsData.filter((loc) => loc.type === 'airport');
        setPickupLocations(pickups);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load booking data';
        toast.error(errorMessage);
        console.error('Error loading booking data:', error);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (pickupLocationId) {
      // Filter compatible dropoff locations based on available routes
      const availableRoutes = routes.filter(
        (route) => route.pickupLocation._id === pickupLocationId && route.active
      );
      
      const availableDropoffs = availableRoutes.map((route) => route.dropoffLocation);
      setDropoffLocations(availableDropoffs);
      
      // Reset dropoff selection when pickup changes
      setValue('dropoffLocationId', '');
      setSelectedRoute(null);
      setPrice(null);
    }
  }, [pickupLocationId, routes, setValue]);

  useEffect(() => {
    if (pickupLocationId && dropoffLocationId) {
      // Find the route for the selected pickup and dropoff
      const route = routes.find(
        (r) => r.pickupLocation._id === pickupLocationId && r.dropoffLocation._id === dropoffLocationId && r.active
      );
      
      setSelectedRoute(route || null);
      setPrice(null); // Reset price until vehicle is selected
    }
  }, [pickupLocationId, dropoffLocationId, routes]);

  useEffect(() => {
    if (selectedRoute && vehicleId) {
      // Find price for the selected route and vehicle
      const vehiclePrice = selectedRoute.prices.find((p) => p.vehicleId === vehicleId);
      
      if (vehiclePrice) {
        setPrice(vehiclePrice.price);
        setSelectedVehicle(vehicles.find((v) => v._id === vehicleId) || null);
      } else {
        setPrice(null);
      }
    }
  }, [selectedRoute, vehicleId, vehicles]);

  const onSubmit = async (data: BookingFormData) => {
    if (!price) {
      toast.error('Please complete all selections to see price');
      return;
    }

    setIsLoading(true);

    try {
      // Format the date for submission
      const formattedDate = format(data.pickupDate, 'yyyy-MM-dd');
      
      const bookingData = {
        ...data,
        pickupDate: formattedDate,
        totalPrice: price,
      };

      const response = await createBooking(bookingData);
      
      // Navigate to confirmation page with booking ID
      navigate(`/booking/confirmation/${response._id}`);
      toast.success('Booking submitted successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred while creating your booking';
      
      toast.error(errorMessage);
      console.error('Booking error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (date: Date) => {
    if (isAfter(date, minDate) || date.toDateString() === minDate.toDateString()) {
      setValue('pickupDate', date);
    }
  };

  return (
    <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow-lg md:p-8">
      <h2 className="mb-6 font-heading text-2xl font-bold text-gray-800 md:text-3xl">Book Your Private Transfer</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Pickup Location */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <MapPin size={18} className="mr-2 text-primary-500" />
              Pickup Location
            </label>
            <select
              {...register('pickupLocationId', { required: 'Pickup location is required' })}
              className="w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="">Select pickup location</option>
              {pickupLocations.map((location) => (
                <option key={location._id} value={location._id}>
                  {location.name}
                </option>
              ))}
            </select>
            {errors.pickupLocationId && (
              <p className="text-sm text-danger-500">{errors.pickupLocationId.message}</p>
            )}
          </div>

          {/* Dropoff Location */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <MapPin size={18} className="mr-2 text-primary-500" />
              Dropoff Location
            </label>
            <select
              {...register('dropoffLocationId', { required: 'Dropoff location is required' })}
              className="w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              disabled={!pickupLocationId}
            >
              <option value="">Select dropoff location</option>
              {dropoffLocations.map((location) => (
                <option key={location._id} value={location._id}>
                  {location.name}
                </option>
              ))}
            </select>
            {errors.dropoffLocationId && (
              <p className="text-sm text-danger-500">{errors.dropoffLocationId.message}</p>
            )}
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Calendar size={18} className="mr-2 text-primary-500" />
              Pickup Date (min. 2 days advance)
            </label>
            <Controller
              control={control}
              name="pickupDate"
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={handleDateChange}
                  minDate={minDate}
                  className="w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  dateFormat="MMMM d, yyyy"
                />
              )}
            />
            {errors.pickupDate && <p className="text-sm text-danger-500">{errors.pickupDate.message}</p>}
          </div>

          {/* Time Picker */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Clock size={18} className="mr-2 text-primary-500" />
              Pickup Time
            </label>
            <select
              {...register('pickupTime', { required: 'Pickup time is required' })}
              className="w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="">Select pickup time</option>
              {Array.from({ length: 24 }).map((_, i) => {
                const hour = i < 10 ? `0${i}` : `${i}`;
                return (
                  <option key={`${hour}:00`} value={`${hour}:00`}>
                    {`${hour}:00`}
                  </option>
                );
              })}
            </select>
            {errors.pickupTime && <p className="text-sm text-danger-500">{errors.pickupTime.message}</p>}
          </div>
        </div>

        {/* Vehicle Selection */}
        {selectedRoute && (
          <div className="rounded-lg bg-gray-50 p-6">
            <h3 className="mb-4 flex items-center font-heading text-xl font-semibold text-gray-800">
              <Car size={20} className="mr-2 text-primary-500" />
              Select Vehicle
            </h3>
            
            <div className="grid gap-4 md:grid-cols-3">
              {vehicles.map((vehicle) => {
                const vehiclePrice = selectedRoute.prices.find((p) => p.vehicleId === vehicle._id)?.price;
                
                return (
                  <div
                    key={vehicle._id}
                    className={`cursor-pointer rounded-lg border p-4 transition-all hover:border-primary-500 ${
                      vehicleId === vehicle._id
                        ? 'border-primary-500 bg-primary-50 shadow-md'
                        : 'border-gray-200 bg-white'
                    }`}
                    onClick={() => setValue('vehicleId', vehicle._id)}
                  >
                    <div className="mb-3 text-center">
                      <img
                        src={vehicle.image || `https://via.placeholder.com/120x80?text=${vehicle.name}`}
                        alt={vehicle.name}
                        className="mx-auto h-20 w-auto object-contain"
                      />
                    </div>
                    <h4 className="text-center font-medium text-gray-800">{vehicle.name}</h4>
                    <p className="mb-2 text-center text-sm text-gray-600">Capacity: {vehicle.capacity} passengers</p>
                    {vehiclePrice ? (
                      <p className="text-center font-semibold text-primary-500">${vehiclePrice.toFixed(2)}</p>
                    ) : (
                      <p className="text-center text-sm text-gray-500">Not available for this route</p>
                    )}
                    
                    <input
                      type="radio"
                      {...register('vehicleId', { required: 'Please select a vehicle' })}
                      value={vehicle._id}
                      className="hidden"
                      disabled={!vehiclePrice}
                    />
                  </div>
                );
              })}
            </div>
            
            {errors.vehicleId && (
              <p className="mt-2 text-center text-sm text-danger-500">{errors.vehicleId.message}</p>
            )}
          </div>
        )}

        {/* Customer Information */}
        <div className="rounded-lg bg-gray-50 p-6">
          <h3 className="mb-4 font-heading text-xl font-semibold text-gray-800">Your Information</h3>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <User size={18} className="mr-2 text-primary-500" />
                Full Name
              </label>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="John Doe"
              />
              {errors.name && <p className="text-sm text-danger-500">{errors.name.message}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Mail size={18} className="mr-2 text-primary-500" />
                Email Address
              </label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className="w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-sm text-danger-500">{errors.email.message}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Phone size={18} className="mr-2 text-primary-500" />
                Phone Number
              </label>
              <input
                type="tel"
                {...register('phone', { required: 'Phone number is required' })}
                className="w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="+1 (555) 123-4567"
              />
              {errors.phone && <p className="text-sm text-danger-500">{errors.phone.message}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <FileText size={18} className="mr-2 text-primary-500" />
                Special Requests (Optional)
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Any special requirements or flight details..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* Price and Submit */}
        <div className="rounded-lg bg-primary-50 p-6">
          <div className="mb-6 flex items-center justify-between">
            <span className="font-heading text-xl font-semibold text-gray-800">Total Price:</span>
            {price ? (
              <span className="text-2xl font-bold text-primary-500">${price.toFixed(2)}</span>
            ) : (
              <span className="text-gray-500">Complete your selection to see price</span>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !price}
            className="w-full rounded-lg bg-primary-500 py-4 text-center font-semibold text-white transition-colors hover:bg-primary-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Processing...
              </span>
            ) : (
              'Proceed to Payment'
            )}
          </button>
          
          <p className="mt-4 text-center text-sm text-gray-600">
            By clicking "Proceed to Payment", you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;