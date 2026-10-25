// server/src/routes/showtimeRoutes.js
import { Router } from 'express';
import {
  getShowtimes,
  getShowtimeById,
  getShowtimeSeats
} from '../controllers/showtimeController.js';

const router = Router();

router.get('/', getShowtimes);
router.get('/:id', getShowtimeById);
router.get('/:id/seats', getShowtimeSeats);

export default router;
