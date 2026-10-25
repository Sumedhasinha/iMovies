// server/src/services/bookingService.js
import mongoose from 'mongoose';
import Showtime from '../models/Showtime.js';
import Booking from '../models/Booking.js';
import Movie from '../models/Movie.js';
import Theatre from '../models/Theatre.js';
import { calculateServerPricing, SEAT_TIERS } from '../utils/pricingCalculator.js';
import { generateBookingReference } from '../utils/generateBookingReference.js';

export class BookingService {
  /**
   * Atomically reserve seats, calculate pricing, and create a confirmed booking
   */
  static async createBooking({
    userId,
    showtimeId,
    seats,
    snacks = [],
    customer,
    paymentMethod = 'card'
  }) {
    // 1. Fetch showtime and populate movie and theatre
    const showtime = await Showtime.findById(showtimeId)
      .populate('movieId')
      .populate('theatreId');

    if (!showtime) {
      const err = new Error('Showtime not found.');
      err.statusCode = 404;
      throw err;
    }

    if (showtime.status !== 'open') {
      const err = new Error(`Showtime is currently not available for bookings (Status: ${showtime.status}).`);
      err.statusCode = 400;
      throw err;
    }

    // 2. Normalize and validate requested seat IDs
    const normalizedSeatIds = seats.map((s) =>
      (typeof s === 'string' ? s.trim().toUpperCase() : s.id?.trim().toUpperCase())
    );

    // Check for duplicates in the request
    const uniqueSeatIds = new Set(normalizedSeatIds);
    if (uniqueSeatIds.size !== normalizedSeatIds.length) {
      const err = new Error('Duplicate seat selections provided in booking request.');
      err.statusCode = 400;
      throw err;
    }

    // Validate seat format (e.g. Row Letter + Column Number, e.g. A1 - J12)
    const validRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J'];
    for (const seatId of normalizedSeatIds) {
      const row = seatId.charAt(0);
      const col = parseInt(seatId.slice(1), 10);
      if (!validRows.includes(row) || isNaN(col) || col < 1 || col > 12) {
        const err = new Error(`Seat ${seatId} does not exist in this auditorium layout.`);
        err.statusCode = 400;
        throw err;
      }
    }

    // 3. ATOMIC DOUBLE-BOOKING PREVENTION
    // Conditionally append seats ONLY IF none of them exist in occupiedSeats
    const updatedShowtime = await Showtime.findOneAndUpdate(
      {
        _id: showtimeId,
        status: 'open',
        'occupiedSeats.seatId': { $nin: normalizedSeatIds }
      },
      {
        $push: {
          occupiedSeats: {
            $each: normalizedSeatIds.map((seatId) => ({
              seatId,
              userId,
              status: 'booked',
              lockedAt: new Date()
            }))
          }
        }
      },
      { new: true }
    );

    // If null, a concurrency collision happened or seats were already booked
    if (!updatedShowtime) {
      const freshShowtime = await Showtime.findById(showtimeId);
      const alreadyOccupied = (freshShowtime?.occupiedSeats || [])
        .map((s) => s.seatId)
        .filter((id) => normalizedSeatIds.includes(id));

      const err = new Error(
        alreadyOccupied.length > 0
          ? `Seat(s) ${alreadyOccupied.join(', ')} were just reserved by another guest. Please select alternative seats.`
          : 'Could not complete seat reservation due to showtime status change.'
      );
      err.statusCode = 409; // Conflict
      throw err;
    }

    // 4. Calculate accurate server pricing (never trust client total)
    const { validatedSeats, validatedSnacks, pricing } = calculateServerPricing(
      normalizedSeatIds,
      showtime.seatPrices,
      snacks
    );

    // 5. Generate unique booking reference
    let bookingReference = generateBookingReference();
    // Ensure uniqueness
    let collisionCheck = await Booking.findOne({ bookingReference });
    while (collisionCheck) {
      bookingReference = generateBookingReference();
      collisionCheck = await Booking.findOne({ bookingReference });
    }

    // 6. Build Movie and Theatre Snapshots
    const movie = showtime.movieId;
    const theatre = showtime.theatreId;

    const movieSnapshot = {
      id: movie?._id?.toString() || movie?.slug || '',
      title: movie?.title || 'Feature Film',
      poster: movie?.posterUrl || '',
      certificate: movie?.certificate || 'PG-13',
      duration: movie?.duration || `${movie?.durationMinutes || 120}m`,
      language: movie?.language || 'English'
    };

    const theatreSnapshot = {
      id: theatre?._id?.toString() || theatre?.slug || '',
      name: theatre?.name || 'Grand Cinema',
      location: theatre?.location || theatre?.address || ''
    };

    const showtimeSnapshot = {
      date: showtime.date,
      time: showtime.time,
      format: showtime.format
    };

    // 7. Create Booking Document
    try {
      const booking = await Booking.create({
        bookingReference,
        userId,
        showtimeId,
        movieSnapshot,
        theatreSnapshot,
        showtimeSnapshot,
        seats: validatedSeats,
        snacks: validatedSnacks,
        pricing,
        customer,
        payment: {
          method: paymentMethod || 'card',
          status: 'completed',
          last4: paymentMethod === 'card' ? '4242' : 'Wallet',
          transactionId: `TXN-${Date.now()}`,
          paidAt: new Date()
        },
        status: 'confirmed'
      });

      // 8. Associate bookingId with showtime occupied seats
      await Showtime.updateOne(
        { _id: showtimeId },
        {
          $set: {
            'occupiedSeats.$[elem].bookingId': booking._id
          }
        },
        {
          arrayFilters: [{ 'elem.seatId': { $in: normalizedSeatIds } }]
        }
      );

      return booking;
    } catch (saveError) {
      // If booking creation failed, safely roll back the occupied seats reservation!
      await Showtime.updateOne(
        { _id: showtimeId },
        {
          $pull: {
            occupiedSeats: { seatId: { $in: normalizedSeatIds }, userId }
          }
        }
      );
      throw saveError;
    }
  }

  /**
   * Cancel a confirmed booking and release seats back to inventory
   */
  static async cancelBooking({ bookingId, userId, isAdmin = false }) {
    let query = {};
    if (mongoose.Types.ObjectId.isValid(bookingId)) {
      query._id = bookingId;
    } else {
      query.bookingReference = bookingId.toUpperCase();
    }

    const booking = await Booking.findOne(query);
    if (!booking) {
      const err = new Error('Booking not found.');
      err.statusCode = 404;
      throw err;
    }

    // Ownership check
    if (!isAdmin && booking.userId.toString() !== userId.toString()) {
      const err = new Error('Unauthorized. You can only cancel your own bookings.');
      err.statusCode = 403;
      throw err;
    }

    if (booking.status === 'cancelled') {
      const err = new Error('This booking has already been cancelled.');
      err.statusCode = 400;
      throw err;
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    await booking.save();

    // Release seats from showtime occupiedSeats
    await Showtime.updateOne(
      { _id: booking.showtimeId },
      {
        $pull: {
          occupiedSeats: { bookingId: booking._id }
        }
      }
    );

    return booking;
  }
}
