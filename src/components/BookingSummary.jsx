// src/components/BookingSummary.jsx
import React from 'react';
import { formatCurrency, SEAT_TIER_CONFIG } from '../utils/pricing';
import { Ticket, Film, Calendar, Clock, MapPin, X, ArrowRight, ShieldCheck, Popcorn } from 'lucide-react';

export default function BookingSummary({
  movie,
  theatre,
  date,
  showtime,
  selectedSeats = [],
  snacks = [],
  pricing,
  onRemoveSeat,
  onRemoveSnack,
  onProceed,
  isProceedDisabled = false,
  ctaText = 'Proceed to Checkout',
  loading = false
}) {
  return (
    <div
      className="card-glass"
      style={{
        padding: '1.75rem',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        border: '1px solid var(--border-light)'
      }}
    >
      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
        Booking Summary
      </h3>

      {/* Movie Details Preview */}
      {movie && (
        <div style={{ display: 'flex', gap: '1rem' }}>
          <img
            src={movie.poster}
            alt={movie.title}
            style={{ width: '64px', height: '90px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.25rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
              {movie.title}
            </h4>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              {movie.certificate && <span className="badge badge-cert">{movie.certificate}</span>}
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{movie.language}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>• {movie.duration}</span>
            </div>
          </div>
        </div>
      )}

      {/* Theatre, Date & Time */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '1rem',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
          fontSize: '0.84rem'
        }}
      >
        {theatre && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <MapPin size={15} color="var(--primary)" />
            <span style={{ color: '#fff', fontWeight: 600 }}>{theatre.name}</span>
          </div>
        )}

        {date && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <Calendar size={15} color="var(--primary)" />
            <span>{date.dayName}, {date.month} {date.dayNumber}</span>
          </div>
        )}

        {showtime && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <Clock size={15} color="var(--primary)" />
            <span>{showtime.time}</span>
            <span className="badge badge-crimson" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
              {showtime.format}
            </span>
          </div>
        )}
      </div>

      {/* Selected Seats Chips */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
          <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Selected Seats ({selectedSeats.length})
          </span>
          {selectedSeats.length === 0 && (
            <span style={{ fontSize: '0.78rem', color: 'var(--accent-gold)' }}>
              Pick seats on the map
            </span>
          )}
        </div>

        {selectedSeats.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {selectedSeats.map((seat) => {
              const tierConfig = SEAT_TIER_CONFIG[seat.tier] || SEAT_TIER_CONFIG.standard;
              return (
                <div
                  key={seat.id}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: 'var(--primary-subtle)',
                    border: '1px solid var(--border-crimson)',
                    borderRadius: '6px',
                    padding: '0.3rem 0.6rem',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#fff'
                  }}
                >
                  <span>{seat.id}</span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    ({tierConfig.label.split(' ')[0]})
                  </span>
                  {onRemoveSeat && (
                    <button
                      type="button"
                      onClick={() => onRemoveSeat(seat)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        padding: 0
                      }}
                      aria-label={`Remove seat ${seat.id}`}
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              padding: '0.85rem',
              border: '1px dashed var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              textAlign: 'center',
              fontSize: '0.82rem',
              color: 'var(--text-muted)'
            }}
          >
            No seats selected yet. Click any available seat.
          </div>
        )}
      </div>

      {/* Selected Snacks Chips if any */}
      {snacks.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            <Popcorn size={14} color="var(--accent-gold)" />
            <span>Snacks & Drinks ({snacks.reduce((a, s) => a + s.quantity, 0)})</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {snacks.map((snack) => (
              <div
                key={snack.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(245, 158, 11, 0.08)',
                  padding: '0.4rem 0.65rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem'
                }}
              >
                <span>{snack.quantity} × {snack.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--accent-gold)' }}>
                    {formatCurrency(snack.price * snack.quantity)}
                  </span>
                  {onRemoveSnack && (
                    <button
                      type="button"
                      onClick={() => onRemoveSnack(snack.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
                      aria-label={`Remove ${snack.name}`}
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transparent Price Breakdown */}
      {pricing && selectedSeats.length > 0 && (
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            fontSize: '0.85rem'
          }}
        >
          {/* Breakdown by Tiers */}
          {Object.entries(pricing.tierBreakdown || {}).map(([tierKey, data]) => {
            if (!data.count) return null;
            const config = SEAT_TIER_CONFIG[tierKey] || SEAT_TIER_CONFIG.standard;
            return (
              <div key={tierKey} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>
                  {data.count} × {config.label} ({formatCurrency(data.price)})
                </span>
                <span>{formatCurrency(data.subtotal)}</span>
              </div>
            );
          })}

          {pricing.snacksSubtotal > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-gold)' }}>
              <span>Concessions Subtotal</span>
              <span>{formatCurrency(pricing.snacksSubtotal)}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>Convenience Fee (${1.50} / seat)</span>
            <span>{formatCurrency(pricing.convenienceFee)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>Service & Entertainment Tax (8%)</span>
            <span>{formatCurrency(pricing.tax)}</span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px dashed var(--border-light)',
              paddingTop: '0.75rem',
              marginTop: '0.25rem'
            }}
          >
            <span style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>Total Amount</span>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>
              {formatCurrency(pricing.total)}
            </span>
          </div>
        </div>
      )}

      {/* CTA Button */}
      <button
        type="button"
        disabled={isProceedDisabled || selectedSeats.length === 0 || loading}
        onClick={onProceed}
        className="btn btn-primary btn-block btn-lg"
        style={{ marginTop: '0.5rem', gap: '0.65rem' }}
      >
        <span>{ctaText}</span>
        <ArrowRight size={18} />
      </button>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <ShieldCheck size={14} color="var(--status-success)" />
        <span>Instant Digital Pass • Contactless Entry</span>
      </div>
    </div>
  );
}
