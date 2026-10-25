// src/components/ShowtimeSelector.jsx
import React, { useState } from 'react';
import { getAvailableDates } from '../utils/dates';
import { Calendar, MapPin, Sparkles, Clock, Check } from 'lucide-react';
import { formatCurrency } from '../utils/pricing';

export default function ShowtimeSelector({
  theatresData = [],
  onConfirmSelection,
  selectedSlot = null,
  selectedDate: propSelectedDate,
  onDateChange,
  loading = false
}) {
  const dates = getAvailableDates(7);
  const [internalSelectedDate, setInternalSelectedDate] = useState(dates[0]);
  const selectedDate = propSelectedDate || internalSelectedDate;
  const [chosenSelection, setChosenSelection] = useState(selectedSlot);

  const handleDateClick = (d) => {
    if (onDateChange) {
      onDateChange(d);
    } else {
      setInternalSelectedDate(d);
    }
    setChosenSelection(null);
  };

  const handleSlotClick = (theatre, showtime) => {
    setChosenSelection({
      theatre,
      date: selectedDate,
      showtime
    });
  };

  const handleContinue = () => {
    if (chosenSelection && onConfirmSelection) {
      onConfirmSelection(chosenSelection);
    }
  };

  return (
    <div className="showtime-selector-component" style={{ marginTop: '2.5rem' }}>
      {/* 1. Date Selector Tabs */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
          <Calendar size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
            Select Date & Experience
          </h3>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '0.65rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem'
          }}
        >
          {dates.map((d) => {
            const isSelected = selectedDate.isoDate === d.isoDate;
            return (
              <button
                key={d.isoDate}
                type="button"
                onClick={() => handleDateClick(d)}
                className={`card-glass ${isSelected ? 'active-date' : ''}`}
                style={{
                  padding: '0.75rem 1.15rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '95px',
                  borderRadius: 'var(--radius-sm)',
                  border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'var(--primary-subtle)' : 'var(--bg-card)',
                  boxShadow: isSelected ? '0 0 16px rgba(229, 9, 20, 0.25)' : 'none',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <span
                  style={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                    fontWeight: 700
                  }}
                >
                  {d.dayName}
                </span>
                <span
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 800,
                    color: isSelected ? '#ffffff' : 'var(--text-primary)',
                    lineHeight: 1.2
                  }}
                >
                  {d.dayNumber}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {d.month}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Theatres & Showtimes List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {loading ? (
          <div
            className="card-glass"
            style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}
          >
            <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid rgba(229,9,20,0.3)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '0.75rem' }} />
            <div>Loading available showtimes...</div>
          </div>
        ) : theatresData.length === 0 ? (
          <div
            className="card-glass"
            style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}
          >
            No showtimes available for the selected cinema and date.
          </div>
        ) : (
          theatresData.map((theatre) => {
            return (
              <div
                key={theatre.id}
                className="card-glass"
                style={{
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                {/* Theatre Header */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    marginBottom: '1.25rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid var(--border-subtle)'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
                      {theatre.name}
                    </h4>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      <MapPin size={13} color="var(--primary)" />
                      {theatre.location}
                    </p>
                  </div>

                  {/* Formats and Amenities */}
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {(theatre.formats || []).map((f) => (
                      <span key={f} className="badge badge-gray" style={{ fontSize: '0.7rem' }}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Showtimes Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                    gap: '0.85rem'
                  }}
                >
                  {(theatre.showtimes || []).map((st, idx) => {
                    const isChosen =
                      chosenSelection?.theatre?.id === theatre.id &&
                      chosenSelection?.showtime?.time === st.time &&
                      chosenSelection?.date?.isoDate === selectedDate.isoDate;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSlotClick(theatre, st)}
                        style={{
                          padding: '0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          border: isChosen ? '1.5px solid var(--primary)' : '1px solid var(--border-light)',
                          background: isChosen ? 'var(--primary)' : 'rgba(255, 255, 255, 0.04)',
                          color: '#fff',
                          textAlign: 'left',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.35rem',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)',
                          boxShadow: isChosen ? '0 0 16px rgba(229, 9, 20, 0.4)' : 'none'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.98rem', fontWeight: 800 }}>
                            {st.time}
                          </span>
                          {isChosen && <Check size={14} />}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: isChosen ? '#ffcccc' : 'var(--text-muted)' }}>
                          <span>{st.format}</span>
                          <span style={{ fontWeight: 600 }}>{formatCurrency(st.priceStandard)}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating or Bottom Continue Action */}
      {chosenSelection && (
        <div
          className="card-glass"
          style={{
            position: 'sticky',
            bottom: '1.5rem',
            marginTop: '2rem',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--primary)',
            background: 'rgba(15, 18, 26, 0.95)',
            boxShadow: '0 12px 35px -5px rgba(0, 0, 0, 0.9), 0 0 20px rgba(229, 9, 20, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            zIndex: 100
          }}
        >
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Selected Showtime
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>{chosenSelection.theatre.name}</span>
              <span style={{ color: 'var(--primary)' }}>•</span>
              <span>{chosenSelection.date.dayName}, {chosenSelection.date.month} {chosenSelection.date.dayNumber}</span>
              <span style={{ color: 'var(--primary)' }}>•</span>
              <span style={{ color: 'var(--accent-gold)' }}>{chosenSelection.showtime.time} ({chosenSelection.showtime.format})</span>
            </div>
          </div>

          <button
            onClick={handleContinue}
            className="btn btn-primary btn-lg"
            style={{ gap: '0.5rem' }}
          >
            <span>Select Seats</span>
            <Sparkles size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
