// src/components/TicketCard.jsx
import React from 'react';
import { formatCurrency } from '../utils/pricing';
import { Film, Calendar, Clock, MapPin, Printer, CheckCircle2, QrCode } from 'lucide-react';

export default function TicketCard({ booking }) {
  if (!booking) return null;

  const { movie, theatre, date, showtime, seats = [], snacks = [], pricing, bookingRef, id } = booking;
  const refCode = bookingRef || id || 'IMV-DEMO';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="ticket-container" id="printable-ticket">
      {/* Notch Cutouts */}
      <div className="ticket-notch-left" />
      <div className="ticket-notch-right" />

      {/* Ticket Header */}
      <div className="ticket-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}
          >
            <Film size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)', fontWeight: 700 }}>
              IMovies VIP E-Ticket
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
              Ref: {refCode}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--status-success)', fontSize: '0.82rem', fontWeight: 600 }}>
          <CheckCircle2 size={16} />
          <span>Confirmed</span>
        </div>
      </div>

      {/* Ticket Main Content */}
      <div className="ticket-body">
        {/* Poster */}
        <div style={{ textAlign: 'center' }}>
          <img
            src={movie?.poster}
            alt={movie?.title}
            style={{
              width: '100%',
              aspectRatio: '2/3',
              objectFit: 'cover',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-subtle)'
            }}
          />
        </div>

        {/* Details Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              {movie?.certificate && <span className="badge badge-cert">{movie.certificate}</span>}
              <span className="badge badge-crimson" style={{ fontSize: '0.68rem' }}>
                {showtime?.format || 'Digital 4K'}
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
              {movie?.title}
            </h2>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <MapPin size={14} color="var(--primary)" />
              {theatre?.name}
            </p>
          </div>

          {/* Schedule Info */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.75rem',
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '0.85rem',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Date</span>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#fff' }}>
                {date?.dayName ? `${date.dayName}, ${date.month} ${date.dayNumber}` : date?.fullFormatted || 'Scheduled Date'}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Showtime</span>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--accent-gold)' }}>
                {showtime?.time || 'Showtime'}
              </div>
            </div>
          </div>

          {/* Seats & Paid */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
                Seats ({seats.length})
              </span>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {seats.map((s) => (
                  <span
                    key={s.id}
                    className="badge badge-crimson"
                    style={{ fontSize: '0.82rem', padding: '0.2rem 0.5rem' }}
                  >
                    {s.id}
                  </span>
                ))}
              </div>
              {snacks && snacks.length > 0 && (
                <div style={{ fontSize: '0.74rem', color: 'var(--accent-gold)', marginTop: '0.35rem' }}>
                  Concessions: {snacks.map((sn) => `${sn.quantity}× ${sn.name}`).join(', ')}
                </div>
              )}
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
                Total Paid
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                {formatCurrency(pricing?.total || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Perforation Line */}
      <div className="ticket-divider" />

      {/* Ticket Footer with Decorative QR & Barcode */}
      <div className="ticket-footer">
        {/* QR Code Graphic */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '68px',
              height: '68px',
              background: '#ffffff',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Custom SVG QR Code representation */}
            <svg viewBox="0 0 33 33" width="100%" height="100%" fill="#0a0b0e">
              <path d="M0,0 h11 v11 h-11 z M2,2 h7 v7 h-7 z M4,4 h3 v3 h-3 z" />
              <path d="M22,0 h11 v11 h-11 z M24,2 h7 v7 h-7 z M26,4 h3 v3 h-3 z" />
              <path d="M0,22 h11 v11 h-11 z M2,24 h7 v7 h-7 z M4,26 h3 v3 h-3 z" />
              <rect x="14" y="2" width="5" height="3" />
              <rect x="14" y="8" width="3" height="4" />
              <rect x="2" y="14" width="4" height="4" />
              <rect x="8" y="14" width="5" height="2" />
              <rect x="15" y="15" width="4" height="4" />
              <rect x="22" y="15" width="3" height="5" />
              <rect x="27" y="14" width="4" height="3" />
              <rect x="14" y="22" width="3" height="7" />
              <rect x="19" y="24" width="5" height="4" />
              <rect x="26" y="26" width="5" height="5" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', letterSpacing: '0.04em' }}>
              DEMO PASS • SIMULATED QR
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', maxWidth: '240px' }}>
              Show this pass on mobile at cinema turnstiles. Created for demo presentation only.
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handlePrint}
          className="btn btn-outline btn-sm"
          style={{ gap: '0.45rem' }}
        >
          <Printer size={15} />
          <span>Print Pass</span>
        </button>
      </div>
    </div>
  );
}
