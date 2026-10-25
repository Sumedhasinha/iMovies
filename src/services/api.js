// src/services/api.js
/**
 * IMovies Live REST API Client
 * 
 * Interacts directly with the Express + MongoDB backend via REST APIs.
 * Includes token authorization, field normalization, and offline mock fallback.
 */

import { storage, STORAGE_KEYS } from '../utils/storage';
import { MOVIES as MOCK_MOVIES, THEATRES as MOCK_THEATRES } from '../data/movies';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Normalizes movie document from backend schema to frontend expectation
 */
function normalizeMovie(m) {
  if (!m) return null;
  return {
    ...m,
    id: m._id || m.slug || m.id,
    poster: m.posterUrl || m.poster,
    backdrop: m.backdropUrl || m.backdrop,
    genre: m.genres || m.genre || ['Drama'],
    duration: m.duration || `${m.durationMinutes || 120}m`,
    status: m.releaseStatus || m.status || 'now_showing'
  };
}

/**
 * Core HTTP Request Wrapper
 */
async function apiRequest(endpoint, options = {}) {
  const token = storage.get(STORAGE_KEYS.AUTH_TOKEN, null);

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (res.status === 401) {
        // Expired or invalid session
        storage.remove(STORAGE_KEYS.AUTH_TOKEN);
        storage.remove(STORAGE_KEYS.AUTH_USER);
      }
      return {
        success: false,
        status: res.status,
        error: data.message || `Request failed with status ${res.status}`,
        errors: data.errors || []
      };
    }

    return data;
  } catch (networkError) {
    console.warn(`[API Network Notice]: Failed to connect to backend (${endpoint}).`, networkError.message);
    return {
      success: false,
      isOffline: true,
      error: 'Backend server is currently offline or unreachable.'
    };
  }
}

/**
 * Fetch all movies with search, filter, and sorting
 * @param {Object} filters - { genre, language, status, search, sortBy }
 */
export async function getMovies(filters = {}) {
  const params = new URLSearchParams();
  if (filters.search && filters.search.trim()) params.append('search', filters.search.trim());
  if (filters.genre && filters.genre !== 'All') params.append('genre', filters.genre);
  if (filters.language && filters.language !== 'All') params.append('language', filters.language);
  if (filters.status && filters.status !== 'All') params.append('status', filters.status);
  if (filters.sortBy && filters.sortBy !== 'default') params.append('sort', filters.sortBy);
  params.append('limit', '50');

  const res = await apiRequest(`/movies?${params.toString()}`);

  if (res.success && Array.isArray(res.data)) {
    const normalized = res.data.map(normalizeMovie);
    return { success: true, count: normalized.length, data: normalized, isLive: true };
  }

  // Fallback to local mock data if server offline
  let fallbackList = [...MOCK_MOVIES];
  if (filters.search && filters.search.trim()) {
    const q = filters.search.trim().toLowerCase();
    fallbackList = fallbackList.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.director.toLowerCase().includes(q) ||
        m.genre.some((g) => g.toLowerCase().includes(q))
    );
  }
  if (filters.genre && filters.genre !== 'All') {
    fallbackList = fallbackList.filter((m) => m.genre.includes(filters.genre));
  }
  if (filters.status && filters.status !== 'All') {
    fallbackList = fallbackList.filter((m) => m.status === filters.status);
  }

  return { success: true, count: fallbackList.length, data: fallbackList, isFallback: true };
}

/**
 * Fetch a single movie by unique slug or ObjectId
 * @param {string} id
 */
export async function getMovieById(id) {
  const res = await apiRequest(`/movies/${id}`);
  if (res.success && res.data) {
    return { success: true, data: normalizeMovie(res.data), isLive: true };
  }

  // Fallback to mock data
  const fallback = MOCK_MOVIES.find((m) => m.id === id || m.slug === id);
  if (fallback) {
    return { success: true, data: fallback, isFallback: true };
  }

  return { success: false, error: res.error || 'Movie not found' };
}

/**
 * Fetch theatres and showtimes for a specific movie & date
 * @param {string} movieId
 * @param {string} date - ISO Date string YYYY-MM-DD
 */
export async function getShowtimes(movieId, date) {
  const res = await apiRequest(`/showtimes?movieId=${encodeURIComponent(movieId)}&date=${date}&grouped=true`);

  if (res.success && Array.isArray(res.data) && res.data.length > 0) {
    return { success: true, count: res.data.length, data: res.data, isLive: true };
  }

  // Fallback to mock schedule
  const movie = MOCK_MOVIES.find((m) => m.id === movieId || m.slug === movieId) || MOCK_MOVIES[0];
  const schedule = (movie.theatres || []).map((tItem) => {
    const theatreMeta = MOCK_THEATRES.find((t) => t.id === tItem.theatreId) || {
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

  return { success: true, data: schedule, isFallback: true };
}

/**
 * Fetch seat layout, tiers, and occupied seats for a showtime
 * @param {string} showtimeId
 */
export async function getShowtimeSeats(showtimeId) {
  if (showtimeId && showtimeId.length === 24) {
    const res = await apiRequest(`/showtimes/${showtimeId}/seats`);
    if (res.success && res.data) {
      return { success: true, data: res.data, isLive: true };
    }
  }

  // Fallback
  return {
    success: true,
    data: {
      occupiedSeats: ['C4', 'D7', 'E5', 'H6'],
      seatPrices: { standard: 14.0, premium: 18.5, vip: 25.0 }
    },
    isFallback: true
  };
}

/**
 * Get occupied seats for a showtime
 * @param {string} showtimeKey - e.g. `${movieId}_${theatreId}_${date}_${time}`
 * @param {string} [showtimeId]
 */
export async function getOccupiedSeats(showtimeKey, showtimeId = null) {
  if (showtimeId && showtimeId.length === 24) {
    const res = await apiRequest(`/showtimes/${showtimeId}/seats`);
    if (res.success && res.data?.occupiedSeats) {
      return { success: true, data: res.data.occupiedSeats, isLive: true };
    }
  }

  // Deterministic local hash fallback
  let hash = 0;
  for (let i = 0; i < (showtimeKey || '').length; i++) {
    hash = (hash << 5) - hash + showtimeKey.charCodeAt(i);
    hash |= 0;
  }
  const occupiedSet = new Set();
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J'];
  const count = 14 + (Math.abs(hash) % 9);
  for (let i = 0; i < count; i++) {
    const rIdx = (Math.abs(hash * (i + 3)) % rows.length);
    const cIdx = 1 + (Math.abs(hash * (i + 7)) % 12);
    occupiedSet.add(`${rows[rIdx]}${cIdx}`);
  }

  // Add locally completed bookings
  const localBookings = storage.get(STORAGE_KEYS.BOOKINGS, []);
  localBookings.forEach((b) => {
    if (b.showtimeKey === showtimeKey && b.status !== 'cancelled') {
      (b.seats || []).forEach((s) => occupiedSet.add(s.id));
    }
  });

  return { success: true, data: Array.from(occupiedSet), isFallback: true };
}

/**
 * Create a new ticket booking in the backend
 * @param {Object} bookingData
 */
export async function createBooking(bookingData) {
  // Try live backend API first if showtimeId is a valid Mongo ObjectId
  if (bookingData.showtimeId && bookingData.showtimeId.length === 24) {
    const res = await apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify({
        showtimeId: bookingData.showtimeId,
        seats: bookingData.seats,
        snacks: bookingData.snacks || [],
        customer: bookingData.customer,
        paymentMethod: bookingData.paymentMethod
      })
    });

    if (res.success && res.data) {
      // Also cache in local storage for seamless offline access
      const existing = storage.get(STORAGE_KEYS.BOOKINGS, []);
      storage.set(STORAGE_KEYS.BOOKINGS, [res.data, ...existing]);
      return { success: true, data: res.data, isLive: true };
    } else if (res.status === 409 || res.status === 400) {
      return { success: false, error: res.error || res.message };
    }
  }

  // Offline demo fallback booking creation
  const bookingId = `IMV-${Math.floor(100000 + Math.random() * 900000)}`;
  const newBooking = {
    id: bookingId,
    bookingRef: bookingId,
    createdAt: new Date().toISOString(),
    status: 'confirmed',
    ...bookingData
  };

  const existing = storage.get(STORAGE_KEYS.BOOKINGS, []);
  storage.set(STORAGE_KEYS.BOOKINGS, [newBooking, ...existing]);

  return { success: true, data: newBooking, isFallback: true };
}

/**
 * Get all bookings for the authenticated user
 */
export async function getMyBookings() {
  const token = storage.get(STORAGE_KEYS.AUTH_TOKEN, null);

  if (token) {
    const res = await apiRequest('/bookings/my');
    if (res.success && Array.isArray(res.data)) {
      storage.set(STORAGE_KEYS.BOOKINGS, res.data);
      return { success: true, data: res.data, isLive: true };
    }
  }

  // Fallback to local storage
  const bookings = storage.get(STORAGE_KEYS.BOOKINGS, []);
  return { success: true, data: bookings, isFallback: true };
}

/**
 * Cancel a booking
 * @param {string} bookingId
 */
export async function cancelBooking(bookingId) {
  const token = storage.get(STORAGE_KEYS.AUTH_TOKEN, null);

  if (token && bookingId && bookingId.length === 24) {
    const res = await apiRequest(`/bookings/${bookingId}/cancel`, {
      method: 'POST'
    });
    if (res.success) {
      return { success: true, data: res.data, isLive: true };
    }
  }

  // Fallback cancellation in localStorage
  const bookings = storage.get(STORAGE_KEYS.BOOKINGS, []);
  const updated = bookings.map((b) => {
    if (b.id === bookingId || b.bookingRef === bookingId) {
      return { ...b, status: 'cancelled', cancelledAt: new Date().toISOString() };
    }
    return b;
  });
  storage.set(STORAGE_KEYS.BOOKINGS, updated);
  return { success: true, isFallback: true };
}

/**
 * User Login
 * @param {Object} credentials - { email, password }
 */
export async function login({ email, password }) {
  const res = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  if (res.success && res.data) {
    storage.set(STORAGE_KEYS.AUTH_TOKEN, res.data.token);
    storage.set(STORAGE_KEYS.AUTH_USER, res.data.user);
    return { success: true, data: res.data.user, token: res.data.token, isLive: true };
  }

  if (res.status === 401 || res.status === 400) {
    return { success: false, error: res.error || 'Invalid email or password.' };
  }

  // Fallback mock login if server unreachable
  const user = {
    id: 'usr_mock_' + Math.random().toString(36).substr(2, 6),
    name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    email,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    role: 'user'
  };
  storage.set(STORAGE_KEYS.AUTH_USER, user);
  return { success: true, data: user, isFallback: true };
}

/**
 * User Signup
 * @param {Object} userData - { name, email, password }
 */
export async function signup({ name, email, password }) {
  const res = await apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  });

  if (res.success && res.data) {
    storage.set(STORAGE_KEYS.AUTH_TOKEN, res.data.token);
    storage.set(STORAGE_KEYS.AUTH_USER, res.data.user);
    return { success: true, data: res.data.user, token: res.data.token, isLive: true };
  }

  if (res.status === 409 || res.status === 400) {
    return { success: false, error: res.error || 'Signup failed with provided details.' };
  }

  // Fallback mock signup if server unreachable
  const user = {
    id: 'usr_mock_' + Math.random().toString(36).substr(2, 6),
    name,
    email,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    role: 'user'
  };
  storage.set(STORAGE_KEYS.AUTH_USER, user);
  return { success: true, data: user, isFallback: true };
}

/**
 * Verify current user session
 */
export async function getMe() {
  const token = storage.get(STORAGE_KEYS.AUTH_TOKEN, null);
  if (!token) return { success: false };

  const res = await apiRequest('/auth/me');
  if (res.success && res.data?.user) {
    storage.set(STORAGE_KEYS.AUTH_USER, res.data.user);
    return { success: true, data: res.data.user, isLive: true };
  }

  return { success: false };
}

/**
 * User Logout
 */
export async function logout() {
  await apiRequest('/auth/logout', { method: 'POST' });
  storage.remove(STORAGE_KEYS.AUTH_TOKEN);
  storage.remove(STORAGE_KEYS.AUTH_USER);
  return { success: true };
}
