import express from 'express';
import {
  getRoutes,
  getRoute,
  createRoute,
  updateRoute,
  deleteRoute
} from '../controllers/routeController.js';
import authenticateUser from '../middleware/authentication.js';
import authorize from '../middleware/authorize.js';

const router = express.Router();

// Public routes
router.get('/', getRoutes);
router.get('/:id', getRoute);

// Protected routes
router.use(authenticateUser);
router.post('/', authorize('admin'), createRoute);
router.put('/:id', authorize('admin'), updateRoute);
router.delete('/:id', authorize('admin'), deleteRoute);

export default router;