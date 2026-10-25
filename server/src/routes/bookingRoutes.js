// server/src/routes/bookingRoutes.js
import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking
} from '../controllers/bookingController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { createBookingValidator, bookingIdValidator } from '../validators/bookingValidators.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { bookingLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// All booking routes require authentication
router.use(authenticate);

router.post('/', bookingLimiter, createBookingValidator, validateRequest, createBooking);
router.get('/my', getMyBookings);
router.get('/:id', bookingIdValidator, validateRequest, getBookingById);
router.post('/:id/cancel', bookingIdValidator, validateRequest, cancelBooking);

export default router;
