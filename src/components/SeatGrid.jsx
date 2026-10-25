// src/components/SeatGrid.jsx
import React from 'react';
import { SEAT_TIER_CONFIG, formatCurrency } from '../utils/pricing';
import { Info, Sparkles } from 'lucide-react';

const ROW_TIERS = {
  A: 'standard',
  B: 'standard',
  C: 'standard',
  D: 'premium',
  E: 'premium',
  F: 'premium',
  G: 'premium',
  H: 'vip',
  J: 'vip'
};

const ROWS = ['J', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A']; // Back to Front order
const SEATS_PER_ROW = 12;

export default function SeatGrid({
  selectedSeats = [],
  occupiedSeats = [],
  onToggleSeat,
  showtimePrices = {}
}) {
  const isOccupied = (seatId) => occupiedSeats.includes(seatId);
  const isSelected = (seatId) => selectedSeats.some((s) => s.id === seatId);

  const getSeatPrice = (tier) => {
    if (tier === 'vip' && showtimePrices.priceVIP) return showtimePrices.priceVIP;
    if (tier === 'premium' && showtimePrices.pricePremium) return showtimePrices.pricePremium;
    if (tier === 'standard' && showtimePrices.priceStandard) return showtimePrices.priceStandard;
    return SEAT_TIER_CONFIG[tier]?.defaultPrice || 14.0;
  };

  const handleSeatClick = (row, col) => {
    const seatId = `${row}${col}`;
    if (isOccupied(seatId)) return;

    const tier = ROW_TIERS[row] || 'standard';
    const price = getSeatPrice(tier);

    onToggleSeat({
      id: seatId,
      row,
      number: col,
      tier,
      price
    });
  };

  return (
    <div className="seat-grid-wrapper" style={{ width: '100%', userSelect: 'none' }}>
      {/* Cinema Curved Screen */}
      <div className="cinema-screen-container">
        <div className="cinema-screen-curve" />
        <div className="cinema-screen-glow" />
        <span className="cinema-screen-label">Auditorium Screen • Eyes Front</span>
      </div>

      {/* Grid of Seats */}
      <div className="seat-grid-container" role="group" aria-label="Auditorium Seating Plan">
        {ROWS.map((row) => {
          const tier = ROW_TIERS[row];
          const tierPrice = getSeatPrice(tier);

          return (
            <div key={row} className="seat-row">
              <span className="row-letter" title={`Row ${row} - ${SEAT_TIER_CONFIG[tier].label}`}>
                {row}
              </span>

              {/* Left Wing (Seats 1 - 3) */}
              <div className="seat-cluster">
                {[1, 2, 3].map((col) => renderSeatBtn(row, col, tier, tierPrice))}
              </div>

              {/* Left Aisle */}
              <div className="aisle-gap" />

              {/* Center Prime Wing (Seats 4 - 9) */}
              <div className="seat-cluster">
                {[4, 5, 6, 7, 8, 9].map((col) => renderSeatBtn(row, col, tier, tierPrice))}
              </div>

              {/* Right Aisle */}
              <div className="aisle-gap" />

              {/* Right Wing (Seats 10 - 12) */}
              <div className="seat-cluster">
                {[10, 11, 12].map((col) => renderSeatBtn(row, col, tier, tierPrice))}
              </div>

              <span className="row-letter" title={`Row ${row} - ${SEAT_TIER_CONFIG[tier].label}`}>
                {row}
              </span>
            </div>
          );
        })}
      </div>

      {/* Interactive Legend */}
      <div className="seat-legend" aria-label="Seat Map Legend">
        <div className="legend-item">
          <div className="legend-swatch" style={{ background: 'var(--seat-available)', border: '1px solid var(--seat-available-border)' }} />
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch" style={{ background: 'var(--primary)', boxShadow: '0 0 8px var(--primary-glow)' }} />
          <span style={{ fontWeight: 600, color: '#fff' }}>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch" style={{ background: 'var(--seat-occupied)', border: '1px solid rgba(255,255,255,0.05)' }} />
          <span style={{ color: 'var(--text-muted)' }}>Occupied (Demo)</span>
        </div>

        <div style={{ width: '1px', height: '18px', background: 'var(--border-subtle)', margin: '0 0.5rem' }} />

        {/* Tiers */}
        <div className="legend-item">
          <div className="legend-swatch" style={{ border: '2px solid #38bdf8', background: 'var(--seat-available)' }} />
          <span>Standard ({formatCurrency(getSeatPrice('standard'))})</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch" style={{ border: '2px solid #f59e0b', background: 'var(--seat-available)' }} />
          <span>Premium ({formatCurrency(getSeatPrice('premium'))})</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch" style={{ border: '2px solid #a855f7', background: '#241d33' }} />
          <span>VIP Recliner ({formatCurrency(getSeatPrice('vip'))})</span>
        </div>
      </div>

      {/* Simulation Notice */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.45rem',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          marginTop: '1.25rem',
          textAlign: 'center'
        }}
      >
        <Info size={14} color="var(--accent-gold)" />
        <span>Demonstration mode: occupied seats and availability are simulated for interface evaluation.</span>
      </div>
    </div>
  );

  function renderSeatBtn(row, col, tier, price) {
    const seatId = `${row}${col}`;
    const occupied = isOccupied(seatId);
    const selected = isSelected(seatId);

    const tierClass =
      tier === 'vip' ? 'seat-tier-vip' : tier === 'premium' ? 'seat-tier-premium' : 'seat-tier-standard';

    return (
      <button
        key={seatId}
        type="button"
        disabled={occupied}
        onClick={() => handleSeatClick(row, col)}
        className={`seat-btn ${tierClass} ${selected ? 'seat-selected' : ''} ${occupied ? 'seat-occupied' : ''}`}
        aria-label={`Seat ${seatId}, ${SEAT_TIER_CONFIG[tier].label}, ${formatCurrency(price)}, ${occupied ? 'Occupied' : selected ? 'Selected' : 'Available'}`}
        title={`${seatId} • ${SEAT_TIER_CONFIG[tier].label} (${formatCurrency(price)})`}
      >
        {col}
      </button>
    );
  }
}
