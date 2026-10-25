// server/src/models/Showtime.js
import mongoose from 'mongoose';

const occupiedSeatSchema = new mongoose.Schema(
  {
    seatId: {
      type: String,
      required: true // e.g. "E6"
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['reserved', 'booked'],
      default: 'booked'
    },
    lockedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const showtimeSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie reference is required'],
      index: true
    },
    theatreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: [true, 'Theatre reference is required'],
      index: true
    },
    screenName: {
      type: String,
      default: 'Auditorium 1'
    },
    format: {
      type: String,
      default: 'Laser 4K'
    },
    date: {
      type: String, // YYYY-MM-DD
      required: [true, 'Showtime date is required (YYYY-MM-DD)'],
      index: true
    },
    time: {
      type: String, // e.g. "06:30 PM"
      required: [true, 'Showtime time string is required']
    },
    startTime: {
      type: Date,
      required: [true, 'Start datetime is required']
    },
    endTime: {
      type: Date
    },
    seatPrices: {
      standard: {
        type: Number,
        required: [true, 'Standard seat price required'],
        min: 0
      },
      premium: {
        type: Number,
        required: [true, 'Premium seat price required'],
        min: 0
      },
      vip: {
        type: Number,
        required: [true, 'VIP seat price required'],
        min: 0
      }
    },
    occupiedSeats: [occupiedSeatSchema],
    status: {
      type: String,
      enum: ['scheduled', 'open', 'sold_out', 'cancelled', 'completed'],
      default: 'open',
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes for fast lookup of movie showtimes by date and theatre
showtimeSchema.index({ movieId: 1, date: 1, status: 1 });
showtimeSchema.index({ theatreId: 1, date: 1 });
showtimeSchema.index({ 'occupiedSeats.seatId': 1 });

const Showtime = mongoose.model('Showtime', showtimeSchema);
export default Showtime;
