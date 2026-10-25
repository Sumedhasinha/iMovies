// server/src/routes/adminRoutes.js
import { Router } from 'express';
import {
  getAdminStats,
  createMovie,
  updateMovie,
  deleteMovie,
  createTheatre,
  createShowtime,
  cancelShowtime,
  getAllBookings
} from '../controllers/adminController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = Router();

// Protect all admin endpoints with both authentication and strict admin check
router.use(authenticate, requireAdmin);

router.get('/stats', getAdminStats);

router.post('/movies', createMovie);
router.put('/movies/:id', updateMovie);
router.delete('/movies/:id', deleteMovie);

router.post('/theatres', createTheatre);

router.post('/showtimes', createShowtime);
router.post('/showtimes/:id/cancel', cancelShowtime);

router.get('/bookings', getAllBookings);

export default router;
