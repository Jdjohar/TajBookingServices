import express from 'express';
import {
  getLocations,
  getLocation,
  createLocation,
  updateLocation,
  deleteLocation
} from '../controllers/locationController.js';
import authenticateUser from '../middleware/authentication.js';
import authorize from '../middleware/authorize.js';

const router = express.Router();

// Public routes
router.get('/', getLocations);
router.get('/:id', getLocation);

// Protected routes
router.use(authenticateUser);
router.post('/', authorize('admin'), createLocation);
router.put('/:id', authorize('admin'), updateLocation);
router.delete('/:id', authorize('admin'), deleteLocation);

export default router;