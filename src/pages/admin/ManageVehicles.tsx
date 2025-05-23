import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Car } from 'lucide-react';
import { toast } from 'react-toastify';
import { Vehicle } from '../../types';
import { fetchVehicles, createVehicle, updateVehicle, deleteVehicle } from '../../services/vehicleService';

const ManageVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const data = await fetchVehicles();
      // Ensure data is an array before setting it to state
      setVehicles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading vehicles:', error);
      toast.error('Failed to load vehicles');
      // Set empty array on error to prevent filter issues
      setVehicles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateVehicle = async (formData: any) => {
    try {
      const newVehicle = await createVehicle(formData);
      setVehicles([...vehicles, newVehicle]);
      toast.success('Vehicle created successfully');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating vehicle:', error);
      toast.error('Failed to create vehicle');
    }
  };

  const handleUpdateVehicle = async (id: string, formData: any) => {
    try {
      const updatedVehicle = await updateVehicle(id, formData);
      setVehicles(vehicles.map(vehicle => vehicle._id === id ? updatedVehicle : vehicle));
      toast.success('Vehicle updated successfully');
      setIsModalOpen(false);
      setEditingVehicle(null);
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast.error('Failed to update vehicle');
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await deleteVehicle(id);
        setVehicles(vehicles.filter(vehicle => vehicle._id !== id));
        toast.success('Vehicle deleted successfully');
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        toast.error('Failed to delete vehicle');
      }
    }
  };

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="font-heading text-2xl font-bold text-gray-900 md:text-3xl">Manage Vehicles</h1>
        <button
          onClick={() => {
            setEditingVehicle(null);
            setIsModalOpen(true);
          }}
          className="flex items-center rounded-lg bg-primary-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-600"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add New Vehicle
        </button>
      </div>

      <div className="mb-6 rounded-lg bg-white p-4 shadow-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredVehicles.map((vehicle) => (
          <div
            key={vehicle._id}
            className="overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-105"
          >
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="h-48 w-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-heading text-xl font-semibold text-gray-900">{vehicle.name}</h3>
                  <p className="mt-1 text-sm text-gray-600">{vehicle.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingVehicle(vehicle);
                      setIsModalOpen(true);
                    }}
                    className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteVehicle(vehicle._id)}
                    className="rounded-full p-2 text-danger-500 hover:bg-danger-50"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Car className="mr-2 h-5 w-5 text-primary-500" />
                  <span className="text-sm font-medium text-gray-600">
                    Capacity: {vehicle.capacity} passengers
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Vehicle Form Modal would go here */}
    </div>
  );
};

export default ManageVehicles;