// server/src/routes/movieRoutes.js
import { Router } from 'express';
import {
  getMovies,
  getMovieById,
  getFeaturedMovies,
  getGenres,
  getNowShowing,
  getComingSoon
} from '../controllers/movieController.js';

const router = Router();

router.get('/featured', getFeaturedMovies);
router.get('/genres', getGenres);
router.get('/now-showing', getNowShowing);
router.get('/coming-soon', getComingSoon);
router.get('/', getMovies);
router.get('/:id', getMovieById);

export default router;
