// server/tests/bookings.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Movie from '../src/models/Movie.js';
import Theatre from '../src/models/Theatre.js';
import Showtime from '../src/models/Showtime.js';
import Booking from '../src/models/Booking.js';
import { generateToken } from '../src/utils/jwtUtils.js';

describe('Cinema Seat Reservation & Booking APIs', () => {
  let user1, user2, token1, token2;
  let testMovie, testTheatre, testShowtime;

  beforeEach(async () => {
    await Booking.deleteMany({});
    await Showtime.deleteMany({});
    await Theatre.deleteMany({});
    await Movie.deleteMany({});
    await User.deleteMany({});

    // 1. Create two test users
    user1 = await User.create({
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: 'AlicePassword123!',
      role: 'user'
    });
    token1 = generateToken(user1);

    user2 = await User.create({
      name: 'Bob Miller',
      email: 'bob@example.com',
      password: 'BobPassword123!',
      role: 'user'
    });
    token2 = generateToken(user2);

    // 2. Create test movie
    testMovie = await Movie.create({
      slug: 'interstellar',
      title: 'Interstellar: Remastered',
      synopsis: 'Deep space exploration.',
      posterUrl: 'https://example.com/interstellar.jpg',
      backdropUrl: 'https://example.com/interstellar-bg.jpg',
      genres: ['Sci-Fi'],
      durationMinutes: 169,
      duration: '2h 49m',
      language: 'English',
      releaseDate: new Date('2024-05-18'),
      releaseStatus: 'now_showing'
    });

    // 3. Create test theatre
    testTheatre = await Theatre.create({
      slug: 'test-theatre-1',
      name: 'Grand IMAX Downtown',
      address: '100 Main St',
      location: 'Downtown Screen 1',
      city: 'Downtown',
      screens: [
        {
          screenNumber: 1,
          name: 'Screen 1',
          format: 'Laser IMAX',
          seatLayout: {
            rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J'],
            columns: 12
          }
        }
      ]
    });

    // 4. Create test showtime with empty seat inventory
    testShowtime = await Showtime.create({
      movieId: testMovie._id,
      theatreId: testTheatre._id,
      screenName: 'Screen 1',
      format: 'Laser IMAX',
      date: '2026-11-01',
      time: '07:00 PM',
      startTime: new Date('2026-11-01T19:00:00Z'),
      seatPrices: {
        standard: 15.00,
        premium: 20.00,
        vip: 28.00
      },
      occupiedSeats: [],
      status: 'open'
    });
  });

  it('should successfully create a booking with server-side price calculation', async () => {
    // E6 is row E (Premium: $20.00). 1 ticket = $20 subtotal + $1.50 fee = $21.50 + 8% tax ($1.72) = $23.22
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        showtimeId: testShowtime._id.toString(),
        seats: [{ id: 'E6' }],
        customer: {
          name: 'Alice Johnson',
          email: 'alice@example.com',
          phone: '+1 (555) 123-4567'
        },
        paymentMethod: 'card'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.bookingRef).toMatch(/^IMV-\d{6}$/);
    expect(res.body.data.seats.length).toBe(1);
    expect(res.body.data.seats[0].id).toBe('E6');
    expect(res.body.data.pricing.subtotal).toBe(20.00);
    expect(res.body.data.pricing.convenienceFee).toBe(1.50);
    expect(res.body.data.pricing.total).toBe(23.22);

    // Verify seat is now occupied in the showtime
    const updatedShowtime = await Showtime.findById(testShowtime._id);
    const occupiedIds = updatedShowtime.occupiedSeats.map((s) => s.seatId);
    expect(occupiedIds).toContain('E6');
  });

  it('should reject booking when a requested seat is already booked', async () => {
    // First, book seat E6
    await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        showtimeId: testShowtime._id.toString(),
        seats: [{ id: 'E6' }],
        customer: {
          name: 'Alice Johnson',
          email: 'alice@example.com',
          phone: '+1 (555) 123-4567'
        }
      });

    // Second user attempts to book the same seat E6
    const conflictRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token2}`)
      .send({
        showtimeId: testShowtime._id.toString(),
        seats: [{ id: 'E6' }],
        customer: {
          name: 'Bob Miller',
          email: 'bob@example.com',
          phone: '+1 (555) 987-6543'
        }
      });

    expect(conflictRes.status).toBe(409);
    expect(conflictRes.body.success).toBe(false);
    expect(conflictRes.body.message).toMatch(/already reserved|alternative seats/i);
  });

  it('CONCURRENCY TEST: should strictly prevent double-booking when two requests race for the same seat', async () => {
    // Simultaneously dispatch two parallel booking requests targeting the exact same seat "D5"
    const [req1, req2] = await Promise.all([
      request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          showtimeId: testShowtime._id.toString(),
          seats: [{ id: 'D5' }],
          customer: { name: 'Alice', email: 'alice@example.com', phone: '+123456789' }
        }),
      request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token2}`)
        .send({
          showtimeId: testShowtime._id.toString(),
          seats: [{ id: 'D5' }],
          customer: { name: 'Bob', email: 'bob@example.com', phone: '+987654321' }
        })
    ]);

    const statuses = [req1.status, req2.status];
    // Exactly ONE request must succeed (201) and the conflicting request MUST be rejected (409)
    expect(statuses).toContain(201);
    expect(statuses).toContain(409);

    // Verify exactly 1 booking exists in DB for this seat
    const bookings = await Booking.find({ 'seats.id': 'D5' });
    expect(bookings.length).toBe(1);

    // Verify showtime has exactly one D5 occupied entry
    const finalShowtime = await Showtime.findById(testShowtime._id);
    const d5Seats = finalShowtime.occupiedSeats.filter((s) => s.seatId === 'D5');
    expect(d5Seats.length).toBe(1);
  });

  it('should enforce booking ownership and prevent unauthorized access to other users bookings', async () => {
    // Alice creates booking
    const bookingRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        showtimeId: testShowtime._id.toString(),
        seats: [{ id: 'A1' }],
        customer: { name: 'Alice', email: 'alice@example.com', phone: '+123456789' }
      });

    const bookingId = bookingRes.body.data.id;

    // Bob tries to read Alice's booking
    const unauthorizedGet = await request(app)
      .get(`/api/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${token2}`);

    expect(unauthorizedGet.status).toBe(403);
    expect(unauthorizedGet.body.success).toBe(false);

    // Bob tries to cancel Alice's booking
    const unauthorizedCancel = await request(app)
      .post(`/api/bookings/${bookingId}/cancel`)
      .set('Authorization', `Bearer ${token2}`);

    expect(unauthorizedCancel.status).toBe(403);
    expect(unauthorizedCancel.body.success).toBe(false);
  });

  it('should successfully cancel a booking and release seats back to showtime inventory', async () => {
    // Alice books seat H1
    const bookingRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        showtimeId: testShowtime._id.toString(),
        seats: [{ id: 'H1' }],
        customer: { name: 'Alice', email: 'alice@example.com', phone: '+123456789' }
      });

    const bookingId = bookingRes.body.data.id;

    // Check seat is initially occupied
    let showtimeCheck = await Showtime.findById(testShowtime._id);
    expect(showtimeCheck.occupiedSeats.some((s) => s.seatId === 'H1')).toBe(true);

    // Alice cancels her booking
    const cancelRes = await request(app)
      .post(`/api/bookings/${bookingId}/cancel`)
      .set('Authorization', `Bearer ${token1}`);

    expect(cancelRes.status).toBe(200);
    expect(cancelRes.body.success).toBe(true);
    expect(cancelRes.body.data.status).toBe('cancelled');

    // Seat H1 should now be released and free for booking!
    showtimeCheck = await Showtime.findById(testShowtime._id);
    expect(showtimeCheck.occupiedSeats.some((s) => s.seatId === 'H1')).toBe(false);

    // Now Bob can book H1 without conflict
    const bobBooking = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token2}`)
      .send({
        showtimeId: testShowtime._id.toString(),
        seats: [{ id: 'H1' }],
        customer: { name: 'Bob', email: 'bob@example.com', phone: '+987654321' }
      });

    expect(bobBooking.status).toBe(201);
  });
});
