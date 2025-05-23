import express from 'express';
import authenticateUser from '../middleware/authentication.js';
import authorize from '../middleware/authorize.js';

const router = express.Router();

// Public routes
router.post('/', createBooking);
router.get('/:id', getBooking);

// Protected routes
router.use(authenticateUser);
router.get('/', authorize('admin', 'staff'), getAllBookings);
router.patch('/:id/status', authorize('admin', 'staff'), updateBookingStatus);
router.patch('/:id/assign-driver', authorize('admin', 'staff'), assignDriver);
router.post('/:id/cancel', cancelBooking);

export default router;