// server/tests/movies.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import Movie from '../src/models/Movie.js';

describe('Movie Discovery & Catalogue APIs', () => {
  beforeEach(async () => {
    await Movie.deleteMany({});

    // Seed test movies
    await Movie.create([
      {
        slug: 'dune-part-two',
        title: 'Dune: Part Two',
        synopsis: 'Paul Atreides unites with Chani.',
        posterUrl: 'https://example.com/dune.jpg',
        backdropUrl: 'https://example.com/dune-bg.jpg',
        genres: ['Sci-Fi', 'Action'],
        rating: 8.8,
        durationMinutes: 166,
        language: 'English',
        releaseDate: new Date('2024-03-01'),
        releaseStatus: 'now_showing',
        featured: true,
        isActive: true
      },
      {
        slug: 'silent-depths',
        title: 'Silent Depths',
        synopsis: 'Acoustic pattern beneath the ice.',
        posterUrl: 'https://example.com/depths.jpg',
        backdropUrl: 'https://example.com/depths-bg.jpg',
        genres: ['Thriller', 'Drama'],
        rating: 8.3,
        durationMinutes: 125,
        language: 'French',
        releaseDate: new Date('2024-02-14'),
        releaseStatus: 'now_showing',
        featured: false,
        isActive: true
      },
      {
        slug: 'chronicles-of-elysium',
        title: 'Chronicles of Elysium',
        synopsis: 'Floating sky islands.',
        posterUrl: 'https://example.com/elysium.jpg',
        backdropUrl: 'https://example.com/elysium-bg.jpg',
        genres: ['Animation', 'Sci-Fi'],
        rating: 8.5,
        durationMinutes: 114,
        language: 'English',
        releaseDate: new Date('2024-06-07'),
        releaseStatus: 'coming_soon',
        featured: false,
        isActive: true
      }
    ]);
  });

  it('should list all active movies with pagination metadata', async () => {
    const res = await request(app).get('/api/movies');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(3);
    expect(res.body.total).toBe(3);
    expect(res.body.page).toBe(1);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it('should search movies by title query parameter safely', async () => {
    const res = await request(app).get('/api/movies?search=dune');

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.data[0].title).toBe('Dune: Part Two');
  });

  it('should filter movies by genre', async () => {
    const res = await request(app).get('/api/movies?genre=Animation');

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.data[0].title).toBe('Chronicles of Elysium');
  });

  it('should filter movies by release status', async () => {
    const res = await request(app).get('/api/movies?status=coming_soon');

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.data[0].releaseStatus).toBe('coming_soon');
  });

  it('should fetch single movie by unique slug or ID', async () => {
    const res = await request(app).get('/api/movies/dune-part-two');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Dune: Part Two');
    expect(res.body.data.duration).toBe('2h 46m');
  });

  it('should return 404 for non-existent movie ID', async () => {
    const res = await request(app).get('/api/movies/non-existent-movie-id-1234');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
