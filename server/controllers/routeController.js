import Route from '../models/Route.js';

// Get all routes
export const getRoutes = async (req, res) => {
  try {
    const routes = await Route.find({})
      .populate('pickupLocation')
      .populate('dropoffLocation')
      .sort('-createdAt');
    
    res.status(200).json(routes);
  } catch (error) {
    console.error('Get routes error:', error);
    res.status(500).json({ message: 'Error fetching routes' });
  }
};

// Get single route
export const getRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id)
      .populate('pickupLocation')
      .populate('dropoffLocation');
    
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    
    res.status(200).json(route);
  } catch (error) {
    console.error('Get route error:', error);
    res.status(500).json({ message: 'Error fetching route' });
  }
};

// Create route
export const createRoute = async (req, res) => {
  const { pickupLocation, dropoffLocation } = req.body;

  try {
    const existingRoute = await Route.findOne({ pickupLocation, dropoffLocation });

    if (existingRoute) {
      return res.status(400).json({
        message: 'A route with the same pickup and dropoff location already exists',
      });
    }

    const route = await Route.create(req.body);
    res.status(201).json(route);
  } catch (error) {
    console.error('Create route error:', error);
    res.status(500).json({ message: 'Error creating route' });
  }
};

// Update route
export const updateRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    
    res.status(200).json(route);
  } catch (error) {
    console.error('Update route error:', error);
    res.status(500).json({ message: 'Error updating route' });
  }
};

// Delete route
export const deleteRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);
    
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    
    res.status(200).json({ message: 'Route deleted successfully' });
  } catch (error) {
    console.error('Delete route error:', error);
    res.status(500).json({ message: 'Error deleting route' });
  }
};