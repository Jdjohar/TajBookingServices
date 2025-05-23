import Vehicle from '../models/Vehicle.js';

// Get all vehicles
export const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({}).sort('name');
    res.status(200).json(vehicles);
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ message: 'Error fetching vehicles' });
  }
};

// Get single vehicle
export const getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    res.status(200).json(vehicle);
  } catch (error) {
    console.error('Get vehicle error:', error);
    res.status(500).json({ message: 'Error fetching vehicle' });
  }
};

// Create vehicle
export const createVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json(vehicle);
  } catch (error) {
    console.error('Create vehicle error:', error);
    res.status(500).json({ message: 'Error creating vehicle' });
  }
};

// Update vehicle
export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    res.status(200).json(vehicle);
  } catch (error) {
    console.error('Update vehicle error:', error);
    res.status(500).json({ message: 'Error updating vehicle' });
  }
};

// Delete vehicle
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({ message: 'Error deleting vehicle' });
  }
};