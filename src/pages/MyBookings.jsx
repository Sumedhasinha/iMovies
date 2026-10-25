// src/pages/MyBookings.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { formatCurrency } from '../utils/pricing';
import Modal from '../components/Modal';
import TicketCard from '../components/TicketCard';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Eye,
  XCircle,
  Film,
  Sparkles,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

export default function MyBookings() {
  const { bookings, cancelBookingById, loadingBookings } = useBooking();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'confirmed', 'cancelled'

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'confirmed') return b.status === 'confirmed';
    if (activeTab === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  const handleConfirmCancel = async () => {
    if (cancelModalBooking) {
      await cancelBookingById(cancelModalBooking.id);
      setCancelModalBooking(null);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <Ticket size={24} color="var(--primary)" />
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>
              My Cinema Bookings
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            Access all your reserved e-tickets, review seat numbers, or cancel demo reservations.
          </p>
        </div>

        <Link to="/movies" className="btn btn-primary btn-sm" style={{ gap: '0.4rem' }}>
          <Film size={15} />
          <span>Book More Movies</span>
        </Link>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
        <button
          onClick={() => setActiveTab('all')}
          className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-ghost'}`}
        >
          All Tickets ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('confirmed')}
          className={`btn btn-sm ${activeTab === 'confirmed' ? 'btn-primary' : 'btn-ghost'}`}
        >
          Confirmed ({bookings.filter((b) => b.status === 'confirmed').length})
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`btn btn-sm ${activeTab === 'cancelled' ? 'btn-primary' : 'btn-ghost'}`}
        >
          Cancelled ({bookings.filter((b) => b.status === 'cancelled').length})
        </button>
      </div>

      {/* Bookings List or Empty State */}
      {filteredBookings.length === 0 ? (
        <div
          className="card-glass"
          style={{
            padding: '4.5rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(229, 9, 20, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(229, 9, 20, 0.3)'
            }}
          >
            <Ticket size={32} color="var(--primary)" />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>
            No Bookings Found
          </h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
            You haven't reserved any cinema tickets yet. Explore trending blockbusters and pick your seats!
          </p>
          <Link to="/movies" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
            Explore Now Showing
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredBookings.map((b) => {
            const isCancelled = b.status === 'cancelled';
            return (
              <div
                key={b.id}
                className="card-glass my-booking-card"
                style={{
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'grid',
                  gridTemplateColumns: '90px 1fr auto',
                  gap: '1.5rem',
                  alignItems: 'center',
                  opacity: isCancelled ? 0.6 : 1,
                  border: isCancelled ? '1px dashed var(--border-subtle)' : '1px solid var(--border-subtle)'
                }}
              >
                {/* Poster */}
                <img
                  src={b.movie?.poster}
                  alt={b.movie?.title}
                  style={{
                    width: '90px',
                    height: '125px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                />

                {/* Middle info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      REF: {b.bookingRef || b.id}
                    </span>
                    {isCancelled ? (
                      <span className="badge badge-gray" style={{ color: 'var(--status-error)' }}>Cancelled</span>
                    ) : (
                      <span className="badge badge-crimson">Confirmed</span>
                    )}
                    <span className="badge badge-cert">{b.movie?.certificate || 'PG-13'}</span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                    {b.movie?.title}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.84rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={14} color="var(--primary)" />
                      {b.theatre?.name}
                    </span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={14} />
                      {b.date?.dayName ? `${b.date.dayName}, ${b.date.month} ${b.date.dayNumber}` : 'Date'}
                    </span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-gold)' }}>
                      <Clock size={14} />
                      {b.showtime?.time} ({b.showtime?.format})
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                    <div style={{ fontSize: '0.84rem', color: '#fff' }}>
                      Seats: <strong style={{ color: 'var(--primary)' }}>{(b.seats || []).map((s) => s.id).join(', ')}</strong>
                    </div>
                    <span style={{ color: 'var(--text-muted)' }}>•</span>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                      Paid: <strong style={{ color: '#fff' }}>{formatCurrency(b.pricing?.total || 0)}</strong>
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '130px' }}>
                  <button
                    onClick={() => setSelectedTicket(b)}
                    className="btn btn-secondary btn-sm"
                    style={{ gap: '0.4rem' }}
                  >
                    <Eye size={14} />
                    <span>View Pass</span>
                  </button>

                  {!isCancelled && (
                    <button
                      onClick={() => setCancelModalBooking(b)}
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ticket Modal */}
      <Modal
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        title="Digital Cinema Pass"
        size="lg"
      >
        {selectedTicket && <TicketCard booking={selectedTicket} />}
      </Modal>

      {/* Cancel Confirmation Dialog Modal */}
      <Modal
        isOpen={!!cancelModalBooking}
        onClose={() => setCancelModalBooking(null)}
        title="Confirm Cancellation"
        size="sm"
      >
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <AlertTriangle size={42} color="var(--status-warning)" style={{ margin: '0 auto 1rem' }} />
          <h4 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '0.5rem' }}>
            Cancel Demo Reservation?
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.75rem' }}>
            Are you sure you want to cancel booking <strong>{cancelModalBooking?.bookingRef}</strong> for {cancelModalBooking?.movie?.title}? Reserved seats will be released immediately.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              onClick={() => setCancelModalBooking(null)}
              className="btn btn-secondary btn-sm"
            >
              Keep Booking
            </button>
            <button
              onClick={handleConfirmCancel}
              className="btn btn-primary btn-sm"
              style={{ background: 'var(--status-error)' }}
            >
              Confirm Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
