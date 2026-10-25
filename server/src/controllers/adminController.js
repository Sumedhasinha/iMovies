// server/src/controllers/adminController.js
import Movie from '../models/Movie.js';
import Theatre from '../models/Theatre.js';
import Showtime from '../models/Showtime.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';

/**
 * Get dashboard overview statistics
 * GET /api/admin/stats
 */
export async function getAdminStats(req, res, next) {
  try {
    const [
      totalMovies,
      totalTheatres,
      totalShowtimes,
      totalUsers,
      totalBookings,
      revenueResult
    ] = await Promise.all([
      Movie.countDocuments({ isActive: true }),
      Theatre.countDocuments({ isActive: true }),
      Showtime.countDocuments({ status: 'open' }),
      User.countDocuments(),
      Booking.countDocuments(),
      Booking.aggregate([
        { $match: { status: 'confirmed' } },
        { $group: { _id: null, totalRevenue: { $sum: '$pricing.total' } } }
      ])
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    return res.status(200).json({
      success: true,
      data: {
        totalMovies,
        totalTheatres,
        totalShowtimes,
        totalUsers,
        totalBookings,
        totalRevenue: Number(totalRevenue.toFixed(2))
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new movie
 * POST /api/admin/movies
 */
export async function createMovie(req, res, next) {
  try {
    const movie = await Movie.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Movie created successfully.',
      data: movie
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update movie details
 * PUT /api/admin/movies/:id
 */
export async function updateMovie(req, res, next) {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Movie updated successfully.',
      data: movie
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Deactivate a movie
 * DELETE /api/admin/movies/:id
 */
export async function deleteMovie(req, res, next) {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Movie deactivated successfully.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new theatre
 * POST /api/admin/theatres
 */
export async function createTheatre(req, res, next) {
  try {
    const theatre = await Theatre.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Theatre created successfully.',
      data: theatre
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new showtime
 * POST /api/admin/showtimes
 */
export async function createShowtime(req, res, next) {
  try {
    const showtime = await Showtime.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Showtime created successfully.',
      data: showtime
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Cancel a showtime
 * POST /api/admin/showtimes/:id/cancel
 */
export async function cancelShowtime(req, res, next) {
  try {
    const showtime = await Showtime.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );

    if (!showtime) {
      return res.status(404).json({ success: false, message: 'Showtime not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Showtime cancelled successfully.',
      data: showtime
    });
  } catch (error) {
    next(error);
  }
}

/**
 * View all system bookings (with pagination)
 * GET /api/admin/bookings
 */
export async function getAllBookings(req, res, next) {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [total, bookings] = await Promise.all([
      Booking.countDocuments(query),
      Booking.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum)
    ]);

    return res.status(200).json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
}
