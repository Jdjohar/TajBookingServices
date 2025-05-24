import express from 'express';
import authenticateUser from '../middleware/authentication.js';
import authorize from '../middleware/authorize.js';
import {
  getDashboardStats,
  getRevenue,
  getTopRoutes,
  getVehicleUtilization,
  getCustomerStats
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateUser);
router.use(authorize('admin'));

// Dashboard stats
router.get('/dashboard', getDashboardStats);
router.get('/revenue', getRevenue);
router.get('/top-routes', getTopRoutes);
router.get('/vehicle-utilization', getVehicleUtilization);
router.get('/customers', getCustomerStats);

export default router;