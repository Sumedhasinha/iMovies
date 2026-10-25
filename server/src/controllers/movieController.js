// server/src/controllers/movieController.js
import mongoose from 'mongoose';
import Movie from '../models/Movie.js';

/**
 * Escape special regex characters to prevent regex injection
 */
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

/**
 * Get all active movies with filtering, sorting, and pagination
 * GET /api/movies
 */
export async function getMovies(req, res, next) {
  try {
    const {
      search,
      genre,
      language,
      status,
      sort,
      page = 1,
      limit = 20
    } = req.query;

    const query = { isActive: true };

    // Search filter
    if (search && search.trim()) {
      const safeSearch = escapeRegex(search.trim());
      query.$or = [
        { title: { $regex: safeSearch, $options: 'i' } },
        { director: { $regex: safeSearch, $options: 'i' } },
        { 'cast.name': { $regex: safeSearch, $options: 'i' } },
        { genres: { $regex: safeSearch, $options: 'i' } }
      ];
    }

    // Genre filter
    if (genre && genre !== 'All') {
      query.genres = genre;
    }

    // Language filter
    if (language && language !== 'All') {
      query.language = { $regex: new RegExp(`^${escapeRegex(language)}$`, 'i') };
    }

    // Status filter
    if (status && status !== 'All') {
      query.releaseStatus = status;
    }

    // Sorting
    let sortOption = { featured: -1, rating: -1, createdAt: -1 };
    if (sort === 'rating') {
      sortOption = { rating: -1 };
    } else if (sort === 'releaseDate') {
      sortOption = { releaseDate: -1 };
    } else if (sort === 'duration') {
      sortOption = { durationMinutes: -1 };
    } else if (sort === 'title') {
      sortOption = { title: 1 };
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [total, movies] = await Promise.all([
      Movie.countDocuments(query),
      Movie.find(query).sort(sortOption).skip(skip).limit(limitNum)
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    return res.status(200).json({
      success: true,
      count: movies.length,
      total,
      page: pageNum,
      totalPages,
      data: movies
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get single movie details by Mongo ID or unique slug
 * GET /api/movies/:id
 */
export async function getMovieById(req, res, next) {
  try {
    const { id } = req.params;
    let movie = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      movie = await Movie.findOne({ _id: id, isActive: true });
    }

    if (!movie) {
      // Try finding by slug for clean human-readable URLs (e.g. /movies/dune-part-two)
      movie = await Movie.findOne({ slug: id.toLowerCase(), isActive: true });
    }

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found with the specified identifier.'
      });
    }

    return res.status(200).json({
      success: true,
      data: movie
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get featured movies for spotlights & hero banners
 * GET /api/movies/featured
 */
export async function getFeaturedMovies(req, res, next) {
  try {
    const movies = await Movie.find({ isActive: true, featured: true }).sort({ rating: -1 }).limit(6);
    return res.status(200).json({
      success: true,
      count: movies.length,
      data: movies
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get distinct active genres
 * GET /api/movies/genres
 */
export async function getGenres(req, res, next) {
  try {
    const genres = await Movie.distinct('genres', { isActive: true });
    return res.status(200).json({
      success: true,
      data: ['All', ...genres.sort()]
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get currently showing movies
 * GET /api/movies/now-showing
 */
export async function getNowShowing(req, res, next) {
  try {
    const movies = await Movie.find({ isActive: true, releaseStatus: 'now_showing' }).sort({ rating: -1 });
    return res.status(200).json({
      success: true,
      count: movies.length,
      data: movies
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get upcoming movies
 * GET /api/movies/coming-soon
 */
export async function getComingSoon(req, res, next) {
  try {
    const movies = await Movie.find({ isActive: true, releaseStatus: 'coming_soon' }).sort({ releaseDate: 1 });
    return res.status(200).json({
      success: true,
      count: movies.length,
      data: movies
    });
  } catch (error) {
    next(error);
  }
}
