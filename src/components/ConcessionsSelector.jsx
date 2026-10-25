// src/components/ConcessionsSelector.jsx
import React from 'react';
import { CONCESSIONS } from '../data/concessions';
import { formatCurrency } from '../utils/pricing';
import { useBooking } from '../context/BookingContext';
import { Plus, Minus, Popcorn, Sparkles } from 'lucide-react';

export default function ConcessionsSelector() {
  const { snacks, addSnack, removeSnack } = useBooking();

  const getQuantity = (id) => {
    const item = (snacks || []).find((s) => s.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <div
      className="card-glass"
      style={{
        padding: '1.75rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Popcorn size={18} color="var(--accent-gold)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
              Cinema Snacks & Gourmet Bar
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Optional: Ready at your assigned seat or VIP express pick-up counter
            </p>
          </div>
        </div>

        {snacks.length > 0 && (
          <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>
            {snacks.reduce((acc, s) => acc + s.quantity, 0)} Items Added
          </span>
        )}
      </div>

      {/* Grid of snacks */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1rem'
        }}
      >
        {CONCESSIONS.map((snack) => {
          const qty = getQuantity(snack.id);
          return (
            <div
              key={snack.id}
              style={{
                display: 'flex',
                gap: '0.85rem',
                padding: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: qty > 0 ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                transition: 'all var(--transition-fast)'
              }}
            >
              <img
                src={snack.image}
                alt={snack.name}
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '6px',
                  objectFit: 'cover',
                  flexShrink: 0
                }}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?q=80&w=200&auto=format&fit=crop';
                }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', lineHeight: 1.25 }}>
                      {snack.name}
                    </h4>
                    {snack.popular && (
                      <span className="badge badge-crimson" style={{ fontSize: '0.62rem', padding: '0.1rem 0.35rem' }}>
                        Popular
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {snack.calories} • {snack.category}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                    {formatCurrency(snack.price)}
                  </span>

                  {qty > 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => removeSnack(snack.id)}
                        className="btn btn-secondary btn-icon"
                        style={{ width: '26px', height: '26px', borderRadius: '4px' }}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span style={{ fontWeight: 700, fontSize: '0.88rem', minWidth: '16px', textAlign: 'center', color: '#fff' }}>
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => addSnack(snack)}
                        className="btn btn-primary btn-icon"
                        style={{ width: '26px', height: '26px', borderRadius: '4px' }}
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => addSnack(snack)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', gap: '0.3rem' }}
                    >
                      <Plus size={13} />
                      <span>Add</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
