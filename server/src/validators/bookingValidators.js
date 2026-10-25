// server/src/validators/bookingValidators.js
import { body, param } from 'express-validator';

export const createBookingValidator = [
  body('showtimeId')
    .notEmpty()
    .withMessage('Showtime ID is required.')
    .isMongoId()
    .withMessage('Invalid Showtime ID format.'),

  body('seats')
    .isArray({ min: 1, max: 8 })
    .withMessage('A booking must specify between 1 and 8 seats.')
    .custom((seats) => {
      const seatIds = seats.map((s) => (typeof s === 'string' ? s.toUpperCase() : s.id?.toUpperCase()));
      const uniqueSeats = new Set(seatIds);
      if (uniqueSeats.size !== seatIds.length) {
        throw new Error('Duplicate seat selections detected in request payload.');
      }
      return true;
    }),

  body('customer.name')
    .trim()
    .notEmpty()
    .withMessage('Customer full name is required for ticket registration.'),

  body('customer.email')
    .trim()
    .notEmpty()
    .withMessage('Customer email is required.')
    .isEmail()
    .withMessage('Please provide a valid email format for ticket delivery.')
    .normalizeEmail(),

  body('customer.phone')
    .trim()
    .notEmpty()
    .withMessage('Customer phone number is required for SMS gate entry verification.')
];

export const bookingIdValidator = [
  param('id')
    .notEmpty()
    .withMessage('Booking reference or ID is required.')
];
