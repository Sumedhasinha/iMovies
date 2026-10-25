// server/src/models/Booking.js
import mongoose from 'mongoose';

const seatSnapshotSchema = new mongoose.Schema(
  {
    id: { type: String, required: true }, // e.g. "E6"
    row: { type: String, required: true },
    number: { type: Number, required: true },
    tier: { type: String, enum: ['standard', 'premium', 'vip'], default: 'standard' },
    price: { type: Number, required: true }
  },
  { _id: false }
);

const snackSnapshotSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 }
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true
    },
    showtimeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Showtime',
      required: [true, 'Showtime reference is required'],
      index: true
    },
    movieSnapshot: {
      id: String,
      title: { type: String, required: true },
      poster: String,
      certificate: String,
      duration: String,
      language: String
    },
    theatreSnapshot: {
      id: String,
      name: { type: String, required: true },
      location: String
    },
    showtimeSnapshot: {
      date: mongoose.Schema.Types.Mixed,
      time: String,
      format: String
    },
    seats: {
      type: [seatSnapshotSchema],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A booking must contain at least one seat.'
      }
    },
    snacks: [snackSnapshotSchema],
    pricing: {
      seatCount: { type: Number, required: true },
      seatsSubtotal: { type: Number, required: true },
      snacksSubtotal: { type: Number, default: 0 },
      subtotal: { type: Number, required: true },
      convenienceFee: { type: Number, required: true },
      tax: { type: Number, required: true },
      total: { type: Number, required: true },
      tierBreakdown: { type: mongoose.Schema.Types.Mixed }
    },
    customer: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, required: true, trim: true }
    },
    payment: {
      method: { type: String, default: 'card' },
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'completed'
      },
      last4: { type: String, default: '4242' },
      transactionId: { type: String },
      paidAt: { type: Date, default: Date.now }
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
      index: true
    },
    cancelledAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Indexes
bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ showtimeId: 1, status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
