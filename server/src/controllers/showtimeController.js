// server/src/controllers/showtimeController.js
import mongoose from 'mongoose';
import Showtime from '../models/Showtime.js';
import Movie from '../models/Movie.js';
import Theatre from '../models/Theatre.js';

/**
 * Query showtimes by movie, date, and theatre
 * GET /api/showtimes
 */
export async function getShowtimes(req, res, next) {
  try {
    const { movieId, date, theatreId, city, grouped = 'false' } = req.query;
    const query = { status: { $in: ['open', 'scheduled'] } };

    // Resolve movieId (could be ObjectId or slug)
    if (movieId) {
      if (mongoose.Types.ObjectId.isValid(movieId)) {
        query.movieId = movieId;
      } else {
        const movie = await Movie.findOne({ slug: movieId.toLowerCase() });
        if (movie) {
          query.movieId = movie._id;
        } else {
          return res.status(200).json({ success: true, count: 0, data: [] });
        }
      }
    }

    // Resolve theatreId (could be ObjectId or slug)
    if (theatreId) {
      if (mongoose.Types.ObjectId.isValid(theatreId)) {
        query.theatreId = theatreId;
      } else {
        const theatre = await Theatre.findOne({ slug: theatreId.toLowerCase() });
        if (theatre) {
          query.theatreId = theatre._id;
        }
      }
    }

    if (date) {
      query.date = date;
    }

    const showtimes = await Showtime.find(query)
      .populate('movieId', 'title posterUrl certificate duration language')
      .populate('theatreId', 'name location city formats amenities screens')
      .sort({ startTime: 1 });

    // If frontend requested grouped-by-theatre format for movie details
    if (grouped === 'true' || req.query.format === 'theatres') {
      const theatreMap = new Map();

      for (const st of showtimes) {
        if (!st.theatreId) continue;
        const tId = st.theatreId._id.toString();

        if (!theatreMap.has(tId)) {
          theatreMap.set(tId, {
            id: st.theatreId._id,
            theatreId: st.theatreId.slug || st.theatreId._id,
            name: st.theatreId.name,
            location: st.theatreId.location,
            city: st.theatreId.city,
            formats: st.theatreId.formats,
            amenities: st.theatreId.amenities,
            date: st.date,
            showtimes: []
          });
        }

        theatreMap.get(tId).showtimes.push({
          id: st._id,
          time: st.time,
          format: st.format,
          screenName: st.screenName,
          priceStandard: st.seatPrices.standard,
          pricePremium: st.seatPrices.premium,
          priceVIP: st.seatPrices.vip,
          status: st.status
        });
      }

      return res.status(200).json({
        success: true,
        count: theatreMap.size,
        data: Array.from(theatreMap.values())
      });
    }

    return res.status(200).json({
      success: true,
      count: showtimes.length,
      data: showtimes
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get showtime details
 * GET /api/showtimes/:id
 */
export async function getShowtimeById(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid showtime ID format.'
      });
    }

    const showtime = await Showtime.findById(id)
      .populate('movieId', 'title posterUrl backdropUrl certificate duration language')
      .populate('theatreId', 'name location city screens formats');

    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: 'Showtime not found.'
      });
    }

    return res.status(200).json({
      success: true,
      data: showtime
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get seat layout, tier pricing, and currently occupied seats for a showtime
 * GET /api/showtimes/:id/seats
 */
export async function getShowtimeSeats(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid showtime ID format.'
      });
    }

    const showtime = await Showtime.findById(id).populate('theatreId');
    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: 'Showtime not found.'
      });
    }

    // Default auditorium seat layout
    const defaultLayout = {
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J'],
      columns: 12,
      tiers: {
        A: 'standard',
        B: 'standard',
        C: 'standard',
        D: 'premium',
        E: 'premium',
        F: 'premium',
        G: 'premium',
        H: 'vip',
        J: 'vip'
      }
    };

    // Extract seat layout from theatre screens or fallback to default
    const screenLayout = showtime.theatreId?.screens?.[0]?.seatLayout || defaultLayout;

    // Extract occupied seat IDs safely (PRIVACY: omit userId and bookingId)
    const occupiedSeatIds = (showtime.occupiedSeats || [])
      .filter((s) => s.status === 'booked' || s.status === 'reserved')
      .map((s) => s.seatId);

    return res.status(200).json({
      success: true,
      data: {
        showtimeId: showtime._id,
        screenName: showtime.screenName,
        format: showtime.format,
        date: showtime.date,
        time: showtime.time,
        seatPrices: showtime.seatPrices,
        seatLayout: screenLayout,
        occupiedSeats: occupiedSeatIds,
        totalSeats: screenLayout.rows.length * screenLayout.columns,
        availableSeatsCount: (screenLayout.rows.length * screenLayout.columns) - occupiedSeatIds.length
      }
    });
  } catch (error) {
    next(error);
  }
}
