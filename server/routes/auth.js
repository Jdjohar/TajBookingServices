import express from 'express';
import { login, register, getCurrentUser } from '../controllers/authController.js';
import authenticateUser from '../middleware/authentication.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user', authenticateUser, getCurrentUser);

export default router;