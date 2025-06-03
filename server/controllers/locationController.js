import Location from '../models/Location.js';

// Get all locations
export const getLocations = async (req, res) => {
  try {
    const locations = await Location.find({}).sort('name');
    res.status(200).json(locations);
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({ message: 'Error fetching locations' });
  }
};

// Get single location
export const getLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    res.status(200).json(location);
  } catch (error) {
    console.error('Get location error:', error);
    res.status(500).json({ message: 'Error fetching location' });
  }
};

// Create location
export const createLocation = async (req, res) => {
  try {
    console.log('Request body:', req.body); // Debug log
    // Debug: Check if the document already exists
    const existingLocation = await Location.findOne({
      name: req.body.name,
      type: req.body.type,
    });
    if (existingLocation) {
      return res.status(400).json({
        message: 'Location with this name and type already exists',
        existing: existingLocation,
      });
    }

    const location = await Location.create(req.body);
    res.status(201).json(location);
  } catch (error) {
    console.error('Create location error:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Location with this name and type already exists',
        conflict: error.keyValue,
      });
    }

    res.status(500).json({ message: 'Error creating location' });
  }
};

// Update location
export const updateLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    res.status(200).json(location);
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ message: 'Error updating location' });
  }
};

// Delete location
export const deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    res.status(200).json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error('Delete location error:', error);
    res.status(500).json({ message: 'Error deleting location' });
  }
};
