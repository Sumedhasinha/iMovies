// server/src/controllers/bookingController.js
import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import { BookingService } from '../services/bookingService.js';

/**
 * Create a new movie ticket reservation
 * POST /api/bookings
 */
export async function createBooking(req, res, next) {
  try {
    const { showtimeId, seats, snacks, customer, paymentMethod } = req.body;

    const booking = await BookingService.createBooking({
      userId: req.user._id,
      showtimeId,
      seats,
      snacks,
      customer: {
        name: customer.name || req.user.name,
        email: customer.email || req.user.email,
        phone: customer.phone
      },
      paymentMethod: paymentMethod?.type || paymentMethod || 'card'
    });

    return res.status(201).json({
      success: true,
      message: 'Tickets reserved successfully.',
      data: formatBookingResponse(booking)
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
}

/**
 * Retrieve authenticated user's booking history
 * GET /api/bookings/my
 */
export async function getMyBookings(req, res, next) {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    const formatted = bookings.map(formatBookingResponse);

    return res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get single booking by ID or reference
 * GET /api/bookings/:id
 */
export async function getBookingById(req, res, next) {
  try {
    const { id } = req.params;
    let query = {};

    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    } else {
      query = { bookingReference: id.toUpperCase() };
    }

    const booking = await Booking.findOne(query);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking reference not found.'
      });
    }

    // Ownership check (only owner or admin can read booking)
    const isOwner = booking.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to view this reservation.'
      });
    }

    return res.status(200).json({
      success: true,
      data: formatBookingResponse(booking)
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Cancel a booking and release seats
 * POST /api/bookings/:id/cancel
 */
export async function cancelBooking(req, res, next) {
  try {
    const { id } = req.params;
    const isAdmin = req.user.role === 'admin';

    const booking = await BookingService.cancelBooking({
      bookingId: id,
      userId: req.user._id,
      isAdmin
    });

    return res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully and seats released.',
      data: formatBookingResponse(booking)
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
}

/**
 * Helper to normalize booking object for frontend compatibility
 */
function formatBookingResponse(b) {
  return {
    id: b._id.toString(),
    bookingRef: b.bookingReference,
    movie: {
      id: b.movieSnapshot?.id,
      title: b.movieSnapshot?.title,
      poster: b.movieSnapshot?.poster,
      certificate: b.movieSnapshot?.certificate,
      duration: b.movieSnapshot?.duration,
      language: b.movieSnapshot?.language
    },
    theatre: {
      id: b.theatreSnapshot?.id,
      name: b.theatreSnapshot?.name,
      location: b.theatreSnapshot?.location
    },
    date: b.showtimeSnapshot?.date,
    showtime: {
      time: b.showtimeSnapshot?.time,
      format: b.showtimeSnapshot?.format
    },
    seats: b.seats,
    snacks: b.snacks || [],
    pricing: b.pricing,
    customer: b.customer,
    paymentMethod: b.payment,
    status: b.status,
    createdAt: b.createdAt,
    cancelledAt: b.cancelledAt
  };
}
