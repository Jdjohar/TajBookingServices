import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';
import { Location } from '../../types';
import { fetchLocations, createLocation, updateLocation, deleteLocation } from '../../services/routeService';

const ManageLocations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    type: 'airport',
    address: '',
  });

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const data = await fetchLocations();
      setLocations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading locations:', error);
      toast.error('Failed to load locations');
      setLocations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const locationData = {
        name: formData.name,
        type: formData.type as 'airport' | 'destination',
        address: formData.address,
      };

      if (editingLocation) {
        const updatedLocation = await updateLocation(editingLocation._id, locationData);
        setLocations(prevLocations => prevLocations.map(location => 
          location._id === editingLocation._id ? updatedLocation : location
        ));
        toast.success('Location updated successfully');
      } else {
        const newLocation = await createLocation(locationData);
        setLocations(prevLocations => [...prevLocations, newLocation]);
        toast.success('Location created successfully');
      }
      
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving location:', error);
      toast.error('Failed to save location');
    }
  };

  const handleDeleteLocation = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        await deleteLocation(id);
        setLocations(prevLocations => prevLocations.filter(location => location._id !== id));
        toast.success('Location deleted successfully');
      } catch (error) {
        console.error('Error deleting location:', error);
        toast.error('Failed to delete location');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'airport',
      address: '',
    });
    setEditingLocation(null);
  };

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      type: location.type,
      address: location.address || '',
    });
    setIsModalOpen(true);
  };

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (location.address && location.address.toLowerCase().includes(searchTerm.toLowerCase()))
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
        <h1 className="font-heading text-2xl font-bold text-gray-900 md:text-3xl">Manage Locations</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center rounded-lg bg-primary-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-600"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add New Location
        </button>
      </div>

      <div className="mb-6 rounded-lg bg-white p-4 shadow-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredLocations.map((location) => (
          <div
            key={location._id}
            className="rounded-lg bg-white p-6 shadow-md transition-transform hover:scale-105"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-primary-500" />
                  <h3 className="font-heading text-lg font-semibold text-gray-900">
                    {location.name}
                  </h3>
                </div>
                {location.address && (
                  <p className="mt-2 text-sm text-gray-600">{location.address}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditLocation(location)}
                  className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteLocation(location._id)}
                  className="rounded-full p-2 text-danger-500 hover:bg-danger-50"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  location.type === 'airport'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {location.type.charAt(0).toUpperCase() + location.type.slice(1)}
              </span>
            </div>
          </div>
        ))}

        {filteredLocations.length === 0 && (
          <div className="col-span-full rounded-lg bg-white p-8 text-center shadow-md">
            <p className="text-gray-500">No locations found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Location Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">
              {editingLocation ? 'Edit Location' : 'Add New Location'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Location Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  required
                >
                  <option value="airport">Airport</option>
                  <option value="destination">Destination</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  placeholder="Optional"
                />
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
                  {editingLocation ? 'Update Location' : 'Create Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageLocations;