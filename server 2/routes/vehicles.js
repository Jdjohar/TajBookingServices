import express from 'express';
import authenticateUser from '../middleware/authentication.js';
import authorize from '../middleware/authorize.js';

const router = express.Router();

// Public routes
router.get('/', getVehicles);
router.get('/:id', getVehicle);

// Protected routes
router.use(authenticateUser);
router.post('/', authorize('admin'), createVehicle);
router.put('/:id', authorize('admin'), updateVehicle);
router.delete('/:id', authorize('admin'), deleteVehicle);

export default router;