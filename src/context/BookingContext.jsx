// src/context/BookingContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { calculateBookingPrice } from '../utils/pricing';
import * as api from '../services/api';
import { useToast } from './ToastContext';

const BookingContext = createContext(null);

const MAX_SEATS_PER_BOOKING = 8;

export function BookingProvider({ children }) {
  const { toast } = useToast();

  // Active in-progress booking state (persisted so refresh doesn't break seat picking)
  const [activeBooking, setActiveBooking] = useState(() => {
    return storage.get(STORAGE_KEYS.ACTIVE_BOOKING, {
      movie: null,
      theatre: null,
      date: null,
      showtime: null,
      seats: [],
      snacks: []
    });
  });

  // Completed booking history
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Sync active booking to localStorage
  useEffect(() => {
    storage.set(STORAGE_KEYS.ACTIVE_BOOKING, activeBooking);
  }, [activeBooking]);

  // Load history on mount
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await api.getMyBookings();
      if (res.success) {
        setBookings(res.data);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  /**
   * Start or update booking session from movie detail showtimes
   */
  const startBooking = ({ movie, theatre, date, showtime }) => {
    setActiveBooking({
      movie,
      theatre,
      date,
      showtime,
      seats: [], // reset seats on new showtime selection
      snacks: []
    });
  };

  /**
   * Add or remove a seat
   * @param {Object} seat - { id: 'E5', row: 'E', number: 5, tier: 'premium', price: 19.5 }
   */
  const toggleSeat = (seat) => {
    setActiveBooking((prev) => {
      const exists = prev.seats.some((s) => s.id === seat.id);

      if (exists) {
        return {
          ...prev,
          seats: prev.seats.filter((s) => s.id !== seat.id)
        };
      }

      if (prev.seats.length >= MAX_SEATS_PER_BOOKING) {
        toast.warning(`Maximum ${MAX_SEATS_PER_BOOKING} seats can be selected per transaction.`);
        return prev;
      }

      return {
        ...prev,
        seats: [...prev.seats, seat]
      };
    });
  };

  const clearSeats = () => {
    setActiveBooking((prev) => ({
      ...prev,
      seats: []
    }));
  };

  /**
   * Snack concessions handling
   */
  const addSnack = (snack) => {
    setActiveBooking((prev) => {
      const currentSnacks = prev.snacks || [];
      const existing = currentSnacks.find((s) => s.id === snack.id);

      let updated;
      if (existing) {
        updated = currentSnacks.map((s) =>
          s.id === snack.id ? { ...s, quantity: (s.quantity || 1) + 1 } : s
        );
      } else {
        updated = [...currentSnacks, { ...snack, quantity: 1 }];
      }

      toast.success(`Added ${snack.name} to order`);
      return { ...prev, snacks: updated };
    });
  };

  const removeSnack = (snackId) => {
    setActiveBooking((prev) => {
      const currentSnacks = prev.snacks || [];
      const existing = currentSnacks.find((s) => s.id === snackId);

      if (!existing) return prev;

      let updated;
      if (existing.quantity > 1) {
        updated = currentSnacks.map((s) =>
          s.id === snackId ? { ...s, quantity: s.quantity - 1 } : s
        );
      } else {
        updated = currentSnacks.filter((s) => s.id !== snackId);
      }
      return { ...prev, snacks: updated };
    });
  };

  const clearSnacks = () => {
    setActiveBooking((prev) => ({
      ...prev,
      snacks: []
    }));
  };

  const resetActiveBooking = () => {
    const emptyState = {
      movie: null,
      theatre: null,
      date: null,
      showtime: null,
      seats: [],
      snacks: []
    };
    setActiveBooking(emptyState);
    storage.remove(STORAGE_KEYS.ACTIVE_BOOKING);
  };

  /**
   * Confirm and finalize demo booking
   */
  const confirmBooking = async ({ customer, paymentMethod }) => {
    if (!activeBooking.movie || !activeBooking.seats.length) {
      toast.error('Booking details are incomplete.');
      return { success: false, error: 'Incomplete booking' };
    }

    const currentSeats = activeBooking.seats || [];
    const currentSnacks = activeBooking.snacks || [];
    const pricing = calculateBookingPrice(currentSeats, currentSnacks);

    const bookingPayload = {
      showtimeId: activeBooking.showtime?._id || activeBooking.showtime?.id || '',
      movie: {
        id: activeBooking.movie.id,
        title: activeBooking.movie.title,
        poster: activeBooking.movie.poster,
        certificate: activeBooking.movie.certificate,
        duration: activeBooking.movie.duration,
        language: activeBooking.movie.language
      },
      theatre: {
        id: activeBooking.theatre.id,
        name: activeBooking.theatre.name,
        location: activeBooking.theatre.location
      },
      date: activeBooking.date,
      showtime: activeBooking.showtime,
      showtimeKey: `${activeBooking.movie.id}_${activeBooking.theatre.id}_${activeBooking.date?.isoDate}_${activeBooking.showtime?.time}`,
      seats: currentSeats,
      snacks: currentSnacks,
      pricing,
      customer,
      paymentMethod,
      bookingRef: `IMV-${Math.floor(100000 + Math.random() * 900000)}`
    };

    const res = await api.createBooking(bookingPayload);
    if (res.success) {
      // Refresh list
      await fetchBookings();
      // Clear active booking draft
      resetActiveBooking();
      toast.success('Cinema tickets reserved successfully!');
      return { success: true, booking: res.data };
    } else {
      toast.error(res.error || 'Failed to complete booking');
      return { success: false, error: res.error };
    }
  };

  /**
   * Cancel an existing booking
   */
  const cancelBookingById = async (bookingId) => {
    const res = await api.cancelBooking(bookingId);
    if (res.success) {
      await fetchBookings();
      toast.info('Booking has been cancelled.');
      return { success: true };
    }
    toast.error('Could not cancel booking.');
    return { success: false };
  };

  const pricing = calculateBookingPrice(activeBooking.seats || [], activeBooking.snacks || []);

  return (
    <BookingContext.Provider
      value={{
        activeBooking,
        seats: activeBooking.seats || [],
        snacks: activeBooking.snacks || [],
        pricing,
        bookings,
        loadingBookings,
        startBooking,
        toggleSeat,
        clearSeats,
        addSnack,
        removeSnack,
        clearSnacks,
        resetActiveBooking,
        confirmBooking,
        cancelBookingById,
        fetchBookings,
        maxSeats: MAX_SEATS_PER_BOOKING
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within a BookingProvider');
  return ctx;
}
