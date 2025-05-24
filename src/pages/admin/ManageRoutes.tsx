import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';
import { Route, Location, Vehicle } from '../../types';
import { fetchRoutes, fetchLocations, createRoute, updateRoute, deleteRoute } from '../../services/routeService';
import { fetchVehicles } from '../../services/vehicleService';

const ManageRoutes = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    pickupLocationId: '',
    dropoffLocationId: '',
    distance: '',
    prices: [] as { vehicleId: string; price: string }[],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [routesData, locationsData, vehiclesData] = await Promise.all([
        fetchRoutes(),
        fetchLocations(),
        fetchVehicles(),
      ]);
      setRoutes(Array.isArray(routesData) ? routesData : []);
      setLocations(Array.isArray(locationsData) ? locationsData : []);
      setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
      
      // Initialize prices array with all vehicles
      if (Array.isArray(vehiclesData)) {
        setFormData(prev => ({
          ...prev,
          prices: vehiclesData.map(vehicle => ({
            vehicleId: vehicle._id,
            price: '',
          })),
        }));
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load routes data');
      setRoutes([]);
      setLocations([]);
      setVehicles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const routeData = {
        pickupLocation: formData.pickupLocationId,
        dropoffLocation: formData.dropoffLocationId,
        distance: Number(formData.distance),
        prices: formData.prices
          .filter(p => p.price !== '') // Remove empty prices
          .map(p => ({
            vehicleId: p.vehicleId,
            price: Number(p.price),
          })),
        active: true,
      };

      if (editingRoute) {
        const updatedRoute = await updateRoute(editingRoute._id, routeData);
        setRoutes(prevRoutes => prevRoutes.map(route => 
          route._id === editingRoute._id ? updatedRoute : route
        ));
        toast.success('Route updated successfully');
      } else {
        const newRoute = await createRoute(routeData);
        setRoutes(prevRoutes => [...prevRoutes, newRoute]);
        toast.success('Route created successfully');
      }
      
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving route:', error);
      toast.error('Failed to save route');
    }
  };

  const handleDeleteRoute = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        await deleteRoute(id);
        setRoutes(prevRoutes => prevRoutes.filter(route => route._id !== id));
        toast.success('Route deleted successfully');
      } catch (error) {
        console.error('Error deleting route:', error);
        toast.error('Failed to delete route');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      pickupLocationId: '',
      dropoffLocationId: '',
      distance: '',
      prices: vehicles.map(vehicle => ({
        vehicleId: vehicle._id,
        price: '',
      })),
    });
    setEditingRoute(null);
  };

  const handleEditRoute = (route: Route) => {
    setEditingRoute(route);
    setFormData({
      pickupLocationId: route.pickupLocation._id,
      dropoffLocationId: route.dropoffLocation._id,
      distance: route.distance.toString(),
      prices: vehicles.map(vehicle => ({
        vehicleId: vehicle._id,
        price: route.prices.find(p => p.vehicleId === vehicle._id)?.price.toString() || '',
      })),
    });
    setIsModalOpen(true);
  };

const filteredRoutes = routes.filter(route => {
  const pickupName = route.pickupLocation?.name?.toLowerCase() || '';
  const dropoffName = route.dropoffLocation?.name?.toLowerCase() || '';
  return pickupName.includes(searchTerm.toLowerCase()) || dropoffName.includes(searchTerm.toLowerCase());
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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-gray-900 md:text-3xl">Manage Routes</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center rounded-lg bg-primary-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-600"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add New Route
        </button>
      </div>

      <div className="mb-6 rounded-lg bg-white p-4 shadow-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search routes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRoutes.map((route) => (
          <div
            key={route._id}
            className="rounded-lg bg-white p-6 shadow-md transition-transform hover:scale-105"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-primary-500" />
                  <h3 className="font-heading text-lg font-semibold text-gray-900">
                    {route.pickupLocation.name}
                  </h3>
                </div>
                <div className="mt-2 flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-primary-500" />
                  <h3 className="font-heading text-lg font-semibold text-gray-900">
                    {route.dropoffLocation.name}
                  </h3>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditRoute(route)}
                  className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteRoute(route._id)}
                  className="rounded-full p-2 text-danger-500 hover:bg-danger-50"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">Distance: {route.distance} miles</p>
              <div className="mt-2">
                <p className="font-medium text-gray-700">Prices:</p>
                <ul className="mt-1 space-y-1">
                  {route.prices.map((price) => {
                    const vehicle = vehicles.find(v => v._id === price.vehicleId);
                    return (
                      <li key={price.vehicleId} className="flex justify-between text-sm">
                        <span className="text-gray-600">{vehicle?.name}</span>
                        <span className="font-medium text-primary-500">${price.price}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  route.active
                    ? 'bg-success-100 text-success-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {route.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Route Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">
              {editingRoute ? 'Edit Route' : 'Add New Route'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pickup Location</label>
                  <select
                    value={formData.pickupLocationId}
                    onChange={(e) => setFormData({ ...formData, pickupLocationId: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    required
                  >
                    <option value="">Select pickup location</option>
                    {locations
                      .filter(loc => loc.type === 'airport')
                      .map(location => (
                        <option key={location._id} value={location._id}>
                          {location.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Dropoff Location</label>
                  <select
                    value={formData.dropoffLocationId}
                    onChange={(e) => setFormData({ ...formData, dropoffLocationId: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    required
                  >
                    <option value="">Select dropoff location</option>
                    {locations
                      .filter(loc => loc.type === 'destination')
                      .map(location => (
                        <option key={location._id} value={location._id}>
                          {location.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Distance (miles)</label>
                  <input
                    type="number"
                    value={formData.distance}
                    onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    required
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Vehicle Prices</label>
                <div className="mt-2 space-y-2">
                  {formData.prices.map((price, index) => {
                    const vehicle = vehicles.find(v => v._id === price.vehicleId);
                    return (
                      <div key={price.vehicleId} className="flex items-center gap-2">
                        <span className="w-1/3">{vehicle?.name}</span>
                        <input
                          type="number"
                          value={price.price}
                          onChange={(e) => {
                            const newPrices = [...formData.prices];
                            newPrices[index].price = e.target.value;
                            setFormData({ ...formData, prices: newPrices });
                          }}
                          className="block w-full rounded-md border border-gray-300 p-2"
                          min="0"
                          step="0.01"
                          placeholder="Enter price"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary-500 px-4 py-2 text-white hover:bg-primary-600"
                >
                  {editingRoute ? 'Update Route' : 'Create Route'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRoutes;