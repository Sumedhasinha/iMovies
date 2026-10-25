// src/pages/BookingConfirmation.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import TicketCard from '../components/TicketCard';
import confetti from 'canvas-confetti';
import { CheckCircle2, Ticket, Home, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

export default function BookingConfirmation() {
  const { bookingId } = useParams();
  const { bookings } = useBooking();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    // Find booking from state or localStorage
    const found = bookings.find((b) => b.id === bookingId || b.bookingRef === bookingId);
    if (found) {
      setBooking(found);
    } else if (bookings.length > 0) {
      // Fallback to most recent booking if user just finished
      setBooking(bookings[0]);
    }

    // Trigger confetti burst celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e50914', '#ffffff', '#f59e0b', '#8b5cf6']
      });
    } catch (e) {
      // Ignore if canvas-confetti is not supported
    }
  }, [bookingId, bookings]);

  if (!booking) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div className="card-glass" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem 2rem' }}>
          <AlertCircle size={44} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.75rem' }}>
            Booking Reference Not Found
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            We could not locate this reservation. It may have been cleared from local storage.
          </p>
          <Link to="/bookings" className="btn btn-primary">
            View My Bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 6rem' }}>
      {/* Success Celebration Banner */}
      <div
        style={{
          textAlign: 'center',
          maxWidth: '650px',
          margin: '0 auto 2.5rem'
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '2px solid var(--status-success)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            boxShadow: '0 0 24px rgba(16, 185, 129, 0.4)'
          }}
        >
          <CheckCircle2 size={36} color="var(--status-success)" />
        </div>

        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff', marginBottom: '0.45rem' }}>
          Booking Confirmed!
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
          Your digital cinema pass has been generated. Confirmation has been dispatched to{' '}
          <strong style={{ color: '#fff' }}>{booking.customer?.email || 'your email'}</strong>.
        </p>
      </div>

      {/* High Fidelity Ticket Layout */}
      <div style={{ marginBottom: '3rem' }}>
        <TicketCard booking={booking} />
      </div>

      {/* Post-Booking Action Links */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}
      >
        <Link to="/bookings" className="btn btn-primary btn-lg" style={{ gap: '0.5rem' }}>
          <Ticket size={18} />
          <span>Go to My Bookings</span>
        </Link>
        <Link to="/" className="btn btn-secondary btn-lg" style={{ gap: '0.5rem' }}>
          <Home size={18} />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
