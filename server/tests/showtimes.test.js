// server/tests/showtimes.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import Movie from '../src/models/Movie.js';
import Theatre from '../src/models/Theatre.js';
import Showtime from '../src/models/Showtime.js';

describe('Theatres & Showtimes APIs', () => {
  let testMovie, testTheatre, testShowtime;

  beforeEach(async () => {
    await Showtime.deleteMany({});
    await Theatre.deleteMany({});
    await Movie.deleteMany({});

    testMovie = await Movie.create({
      slug: 'oppenheimer',
      title: 'Oppenheimer',
      synopsis: 'Atomic era drama.',
      posterUrl: 'https://example.com/opp.jpg',
      backdropUrl: 'https://example.com/opp-bg.jpg',
      genres: ['Drama', 'History'],
      durationMinutes: 180,
      language: 'English',
      releaseDate: new Date('2023-07-21'),
      releaseStatus: 'now_showing'
    });

    testTheatre = await Theatre.create({
      slug: 'cineluxe',
      name: 'CineLuxe Dolby Cinema',
      address: '200 West Ave',
      location: 'Westfield Grand Avenue',
      city: 'Downtown',
      formats: ['Dolby Cinema'],
      screens: [
        {
          screenNumber: 1,
          name: 'Screen 1',
          format: 'Dolby Cinema',
          seatLayout: {
            rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J'],
            columns: 12
          }
        }
      ]
    });

    testShowtime = await Showtime.create({
      movieId: testMovie._id,
      theatreId: testTheatre._id,
      screenName: 'Screen 1',
      format: 'Dolby Cinema',
      date: '2026-11-05',
      time: '04:00 PM',
      startTime: new Date('2026-11-05T16:00:00Z'),
      seatPrices: {
        standard: 15.0,
        premium: 19.5,
        vip: 26.0
      },
      occupiedSeats: [
        { seatId: 'C4', status: 'booked' },
        { seatId: 'D5', status: 'booked' }
      ],
      status: 'open'
    });
  });

  it('should retrieve list of active theatres', async () => {
    const res = await request(app).get('/api/theatres');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(1);
    expect(res.body.data[0].name).toBe('CineLuxe Dolby Cinema');
  });

  it('should query showtimes by movie and date', async () => {
    const res = await request(app).get(`/api/showtimes?movieId=${testMovie._id}&date=2026-11-05`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(1);
    expect(res.body.data[0].time).toBe('04:00 PM');
  });

  it('should retrieve seat layout, prices, and occupied seats without leaking user IDs', async () => {
    const res = await request(app).get(`/api/showtimes/${testShowtime._id}/seats`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.seatPrices.standard).toBe(15.0);
    expect(res.body.data.seatPrices.premium).toBe(19.5);
    expect(res.body.data.seatPrices.vip).toBe(26.0);
    expect(res.body.data.occupiedSeats).toContain('C4');
    expect(res.body.data.occupiedSeats).toContain('D5');

    // PRIVACY CHECK: occupiedSeats array contains only seat strings, never user objects
    for (const seat of res.body.data.occupiedSeats) {
      expect(typeof seat).toBe('string');
    }
  });

  it('should return 400 for malformed showtime ID', async () => {
    const res = await request(app).get('/api/showtimes/invalid-showtime-id/seats');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
