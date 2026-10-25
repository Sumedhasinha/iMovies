// src/services/api.js
/**
 * IMovies API Client & Service Layer
 * 
 * FUTURE BACKEND READINESS NOTE:
 * This module is architected as an abstraction layer ready to be swapped with
 * Axios or Fetch calls to an Express.js / Node.js backend backed by MongoDB.
 * 
 * Currently, it simulates asynchronous REST requests using our rich in-memory
 * mock dataset and persists user bookings & authentication into browser LocalStorage.
 */

import { MOVIES, THEATRES } from '../data/movies';
import { storage, STORAGE_KEYS } from '../utils/storage';

const SIMULATED_DELAY_MS = 80;

const delay = (ms = SIMULATED_DELAY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch all movies, with optional query filters
 * @param {Object} filters - { genre, language, status, search, sortBy }
 */
export async function getMovies(filters = {}) {
  await delay();
  let results = [...MOVIES];

  if (filters.search && filters.search.trim()) {
    const q = filters.search.trim().toLowerCase();
    results = results.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.director.toLowerCase().includes(q) ||
        m.cast.some((c) => c.name.toLowerCase().includes(q)) ||
        m.genre.some((g) => g.toLowerCase().includes(q))
    );
  }

  if (filters.genre && filters.genre !== 'All') {
    results = results.filter((m) => m.genre.includes(filters.genre));
  }

  if (filters.language && filters.language !== 'All') {
    results = results.filter((m) => m.language.toLowerCase() === filters.language.toLowerCase());
  }

  if (filters.status && filters.status !== 'All') {
    results = results.filter((m) => m.status === filters.status);
  }

  if (filters.sortBy) {
    if (filters.sortBy === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'releaseDate') {
      results.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    } else if (filters.sortBy === 'duration') {
      results.sort((a, b) => b.durationMinutes - a.durationMinutes);
    } else if (filters.sortBy === 'title') {
      results.sort((a, b) => a.title.localeCompare(b.title));
    }
    // Default: trending / popularity order as in array
  }

  return { success: true, count: results.length, data: results };
}

/**
 * Fetch a single movie by unique ID
 * @param {string} id
 */
export async function getMovieById(id) {
  await delay();
  const movie = MOVIES.find((m) => m.id === id);
  if (!movie) {
    return { success: false, error: 'Movie not found' };
  }
  return { success: true, data: movie };
}

/**
 * Fetch theatres and showtimes for a specific movie & date
 * @param {string} movieId
 * @param {string} date - ISO Date string YYYY-MM-DD
 */
export async function getShowtimes(movieId, date) {
  await delay();
  const movie = MOVIES.find((m) => m.id === movieId);
  if (!movie) {
    return { success: false, error: 'Movie not found' };
  }

  // Combine movie theatres with global THEATRES metadata
  const schedule = (movie.theatres || []).map((tItem) => {
    const theatreMeta = THEATRES.find((t) => t.id === tItem.theatreId) || {
      id: tItem.theatreId,
      name: 'Grand Cinema Screen',
      location: 'Main Auditorium',
      formats: ['Digital 2D']
    };

    return {
      ...theatreMeta,
      date,
      showtimes: tItem.showtimes
    };
  });

  return { success: true, data: schedule };
}

/**
 * Generate reproducible mock occupied seats for a given showtime ID
 * In a real backend, this queries the bookings collection for reserved seats
 * @param {string} showtimeKey - combination of `${movieId}_${theatreId}_${date}_${time}`
 */
export async function getOccupiedSeats(showtimeKey) {
  await delay();
  // Deterministic hash based on showtime key so same showtime has stable occupied seats in demo
  let hash = 0;
  for (let i = 0; i < (showtimeKey || '').length; i++) {
    hash = (hash << 5) - hash + showtimeKey.charCodeAt(i);
    hash |= 0;
  }

  const occupiedSet = new Set();
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J'];
  const cols = 12;

  // Add 14-22 deterministic occupied seats
  const count = 14 + (Math.abs(hash) % 9);
  for (let i = 0; i < count; i++) {
    const rIdx = (Math.abs(hash * (i + 3)) % rows.length);
    const cIdx = 1 + (Math.abs(hash * (i + 7)) % cols);
    occupiedSet.add(`${rows[rIdx]}${cIdx}`);
  }

  // Also include seats from locally completed bookings for this showtime
  const localBookings = storage.get(STORAGE_KEYS.BOOKINGS, []);
  localBookings.forEach((b) => {
    if (b.showtimeKey === showtimeKey && b.status !== 'cancelled') {
      (b.seats || []).forEach((s) => occupiedSet.add(s.id));
    }
  });

  return { success: true, data: Array.from(occupiedSet) };
}

/**
 * Create a new demo booking record and persist to LocalStorage
 * @param {Object} bookingData
 */
export async function createBooking(bookingData) {
  await delay(120);

  if (!bookingData.movie || !bookingData.seats || bookingData.seats.length === 0) {
    return { success: false, error: 'Invalid booking data. Seats and movie required.' };
  }

  const bookingId = `IMV-${Math.floor(100000 + Math.random() * 900000)}`;
  const timestamp = new Date().toISOString();

  const newBooking = {
    id: bookingId,
    createdAt: timestamp,
    status: 'confirmed',
    ...bookingData
  };

  const existing = storage.get(STORAGE_KEYS.BOOKINGS, []);
  const updated = [newBooking, ...existing];
  storage.set(STORAGE_KEYS.BOOKINGS, updated);

  return { success: true, data: newBooking };
}

const DEFAULT_DEMO_BOOKINGS = [
  {
    id: 'IMV-739201',
    bookingRef: 'IMV-739201',
    createdAt: new Date().toISOString(),
    status: 'confirmed',
    movie: {
      id: 'dune-part-two',
      title: 'Dune: Part Two',
      poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
      certificate: 'PG-13',
      duration: '2h 46m',
      language: 'English'
    },
    theatre: {
      id: 'th-1',
      name: 'Starlight IMAX Cinema & Lounge',
      location: 'Downtown Cultural Hub, Screen 1 (Laser IMAX)'
    },
    date: {
      isoDate: new Date().toISOString().split('T')[0],
      dayName: 'Today',
      month: 'Oct',
      dayNumber: 24,
      fullFormatted: 'Tonight, Laser IMAX Screen 1'
    },
    showtime: {
      time: '06:30 PM',
      format: 'Laser IMAX'
    },
    seats: [
      { id: 'E6', row: 'E', number: 6, tier: 'premium', price: 21.0 },
      { id: 'E7', row: 'E', number: 7, tier: 'premium', price: 21.0 }
    ],
    pricing: {
      seatCount: 2,
      subtotal: 42.00,
      convenienceFee: 3.00,
      tax: 3.60,
      total: 48.60,
      tierBreakdown: {
        premium: { count: 2, price: 21.0, subtotal: 42.0 }
      }
    },
    customer: {
      name: 'Alex Morgan',
      email: 'alex.morgan@imovies.vip',
      phone: '+1 (555) 389-2044'
    },
    paymentMethod: {
      type: 'card',
      last4: '4242'
    }
  }
];

/**
 * Get all demo bookings for the current session/user
 */
export async function getMyBookings() {
  await delay();
  let bookings = storage.get(STORAGE_KEYS.BOOKINGS, null);
  if (bookings === null) {
    storage.set(STORAGE_KEYS.BOOKINGS, DEFAULT_DEMO_BOOKINGS);
    bookings = DEFAULT_DEMO_BOOKINGS;
  }
  return { success: true, data: bookings };
}

/**
 * Cancel a demo booking
 * @param {string} bookingId
 */
export async function cancelBooking(bookingId) {
  await delay();
  const bookings = storage.get(STORAGE_KEYS.BOOKINGS, []);
  const updated = bookings.map((b) => {
    if (b.id === bookingId) {
      return { ...b, status: 'cancelled', cancelledAt: new Date().toISOString() };
    }
    return b;
  });
  storage.set(STORAGE_KEYS.BOOKINGS, updated);
  return { success: true };
}

/**
 * Demo Login
 * @param {Object} credentials - { email, password }
 */
export async function login({ email, password }) {
  await delay(100);
  if (!email || !password) {
    return { success: false, error: 'Email and password are required' };
  }
  const user = {
    id: 'usr_' + Math.random().toString(36).substr(2, 9),
    name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    email,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    role: 'cinema_club_member'
  };

  storage.set(STORAGE_KEYS.AUTH_USER, user);
  return { success: true, data: user };
}

/**
 * Demo Signup
 * @param {Object} userData - { name, email, password }
 */
export async function signup({ name, email, password }) {
  await delay(100);
  if (!name || !email || !password) {
    return { success: false, error: 'Name, email, and password are required' };
  }

  const user = {
    id: 'usr_' + Math.random().toString(36).substr(2, 9),
    name,
    email,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    role: 'cinema_club_member'
  };

  storage.set(STORAGE_KEYS.AUTH_USER, user);
  return { success: true, data: user };
}

/**
 * Sign out current demo user
 */
export async function logout() {
  await delay(50);
  storage.remove(STORAGE_KEYS.AUTH_USER);
  return { success: true };
}
