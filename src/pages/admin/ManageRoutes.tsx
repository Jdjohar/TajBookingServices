import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';
import { Route, Location } from '../../types';
import { fetchRoutes, fetchLocations, createRoute, updateRoute, deleteRoute } from '../../services/routeService';

const ManageRoutes = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [routesData, locationsData] = await Promise.all([
        fetchRoutes(),
        fetchLocations(),
      ]);
      setRoutes(Array.isArray(routesData) ? routesData : []);
      setLocations(Array.isArray(locationsData) ? locationsData : []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load routes data');
      setRoutes([]);
      setLocations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRoute = async (formData: any) => {
    try {
      const newRoute = await createRoute(formData);
      setRoutes(prevRoutes => [...prevRoutes, newRoute]);
      toast.success('Route created successfully');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating route:', error);
      toast.error('Failed to create route');
    }
  };

  const handleUpdateRoute = async (id: string, formData: any) => {
    try {
      const updatedRoute = await updateRoute(id, formData);
      setRoutes(prevRoutes => prevRoutes.map(route => route._id === id ? updatedRoute : route));
      toast.success('Route updated successfully');
      setIsModalOpen(false);
      setEditingRoute(null);
    } catch (error) {
      console.error('Error updating route:', error);
      toast.error('Failed to update route');
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

  const filteredRoutes = routes.filter(route => 
    route.pickupLocation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.dropoffLocation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            setEditingRoute(null);
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
                  onClick={() => {
                    setEditingRoute(route);
                    setIsModalOpen(true);
                  }}
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
                  {route.prices.map((price) => (
                    <li key={price.vehicleId} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {vehicles.find(v => v._id === price.vehicleId)?.name}
                      </span>
                      <span className="font-medium text-primary-500">${price.price}</span>
                    </li>
                  ))}
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

      {/* Route Form Modal would go here */}
    </div>
  );
};

export default ManageRoutes;