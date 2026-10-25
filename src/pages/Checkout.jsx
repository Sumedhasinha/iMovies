// src/pages/Checkout.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, SEAT_TIER_CONFIG } from '../utils/pricing';
import {
  CreditCard,
  ShieldCheck,
  Smartphone,
  Building,
  Lock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Film,
  Calendar,
  Clock,
  MapPin,
  Sparkles
} from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const { activeBooking, seats, snacks = [], pricing, confirmBooking } = useBooking();
  const { user } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    name: user?.name || 'Alex Morgan',
    email: user?.email || 'alex.morgan@imovies.vip',
    phone: '+1 (555) 389-2044',
    cardNumber: '•••• •••• •••• 4242',
    cardExp: '12/28',
    cardCvv: '•••'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If no booking in progress or seats empty
  if (!activeBooking?.movie || !seats || seats.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div className="card-glass" style={{ maxWidth: '520px', margin: '0 auto', padding: '3rem 2rem' }}>
          <Film size={48} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '0.75rem' }}>
            No Active Reservation Found
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
            Please select a movie and reserve your preferred seats before proceeding to checkout.
          </p>
          <Link to="/movies" className="btn btn-primary">
            Browse Movies & Showtimes
          </Link>
        </div>
      </div>
    );
  }

  const { movie, theatre, date, showtime } = activeBooking;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please provide a valid email format';
    }
    if (!formData.phone.trim()) errs.phone = 'Mobile phone number is required';

    if (paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) errs.cardNumber = 'Card number is required';
      if (!formData.cardExp.trim()) errs.cardExp = 'Expiry date required';
      if (!formData.cardCvv.trim()) errs.cardCvv = 'CVV required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await confirmBooking({
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        paymentMethod: {
          type: paymentMethod,
          last4: paymentMethod === 'card' ? '4242' : 'Wallet'
        }
      });

      if (res.success && res.booking) {
        navigate(`/booking-confirmation/${res.booking.id}`);
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Back button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to={`/booking/${movie.id}`}
          className="btn btn-secondary btn-sm"
          style={{ gap: '0.4rem' }}
        >
          <ArrowLeft size={16} />
          <span>Change Seats</span>
        </Link>
      </div>

      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
        Express Demo Checkout
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
        Review your order and enter ticket recipient details. Demo payment simulation only.
      </p>

      {/* 2-Column Checkout Layout */}
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.6fr) minmax(320px, 1fr)',
            gap: '2.5rem',
            alignItems: 'start'
          }}
        >
          {/* Left Column: Contact & Payment Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* 1. Recipient Details */}
            <div
              className="card-glass"
              style={{ padding: '1.75rem', borderRadius: 'var(--radius-md)' }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>1</span>
                Contact & Ticket Delivery
              </h3>

              <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Alex Morgan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {errors.name && <span className="form-error"><AlertCircle size={13} /> {errors.name}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address (E-Ticket Delivery)</label>
                  <input
                    id="email"
                    type="email"
                    className="form-input"
                    placeholder="alex.morgan@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  {errors.email && <span className="form-error"><AlertCircle size={13} /> {errors.email}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Phone (SMS Gate Alerts)</label>
                  <input
                    id="phone"
                    type="tel"
                    className="form-input"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  {errors.phone && <span className="form-error"><AlertCircle size={13} /> {errors.phone}</span>}
                </div>
              </div>
            </div>

            {/* 2. Payment Method Selector */}
            <div
              className="card-glass"
              style={{ padding: '1.75rem', borderRadius: 'var(--radius-md)' }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>2</span>
                Payment Method (Demo Mode)
              </h3>

              {/* Payment Tabs */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.75rem',
                  marginBottom: '1.5rem'
                }}
              >
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: paymentMethod === 'card' ? '1.5px solid var(--primary)' : '1px solid var(--border-light)',
                    background: paymentMethod === 'card' ? 'var(--primary-subtle)' : 'rgba(255, 255, 255, 0.03)',
                    color: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer'
                  }}
                >
                  <CreditCard size={20} color={paymentMethod === 'card' ? 'var(--primary)' : 'var(--text-muted)'} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('wallet')}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: paymentMethod === 'wallet' ? '1.5px solid var(--primary)' : '1px solid var(--border-light)',
                    background: paymentMethod === 'wallet' ? 'var(--primary-subtle)' : 'rgba(255, 255, 255, 0.03)',
                    color: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer'
                  }}
                >
                  <Smartphone size={20} color={paymentMethod === 'wallet' ? 'var(--primary)' : 'var(--text-muted)'} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Apple / Google Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: paymentMethod === 'upi' ? '1.5px solid var(--primary)' : '1px solid var(--border-light)',
                    background: paymentMethod === 'upi' ? 'var(--primary-subtle)' : 'rgba(255, 255, 255, 0.03)',
                    color: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer'
                  }}
                >
                  <Building size={20} color={paymentMethod === 'upi' ? 'var(--primary)' : 'var(--text-muted)'} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>UPI / NetBanking</span>
                </button>
              </div>

              {/* Demo Fields Based on Method */}
              {paymentMethod === 'card' && (
                <div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="cardNum">Card Number (Simulated)</label>
                    <input
                      id="cardNum"
                      type="text"
                      className="form-input"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                    />
                    {errors.cardNumber && <span className="form-error"><AlertCircle size={13} /> {errors.cardNumber}</span>}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="cardExp">Expiry Date (MM/YY)</label>
                      <input
                        id="cardExp"
                        type="text"
                        className="form-input"
                        value={formData.cardExp}
                        onChange={(e) => setFormData({ ...formData, cardExp: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="cardCvv">Security CVV</label>
                      <input
                        id="cardCvv"
                        type="password"
                        maxLength="4"
                        className="form-input"
                        value={formData.cardCvv}
                        onChange={(e) => setFormData({ ...formData, cardCvv: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'wallet' && (
                <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                  <span>One-touch verification via Apple Pay / Google Wallet is pre-authorized in demonstration mode.</span>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                  <span>Instant UPI QR and simulated bank portal will approve automatically upon clicking Confirm.</span>
                </div>
              )}

              {/* Disclaimer Security Notice */}
              <div
                style={{
                  marginTop: '1.5rem',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  fontSize: '0.8rem',
                  color: '#6ee7b7'
                }}
              >
                <Lock size={16} style={{ flexShrink: 0 }} />
                <span>
                  Demo Mode Active: No real financial transactions will be made. Do not submit sensitive personal card credentials.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div
            className="card-glass"
            style={{
              padding: '1.75rem',
              borderRadius: 'var(--radius-md)',
              position: 'sticky',
              top: 'calc(var(--navbar-height) + 1.5rem)',
              border: '1px solid var(--border-light)'
            }}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
              Order Review
            </h3>

            {/* Movie preview */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
              <img
                src={movie.poster}
                alt={movie.title}
                style={{ width: '60px', height: '85px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
              />
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{movie.title}</h4>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {movie.language} • {movie.duration}
                </div>
                <div style={{ marginTop: '0.35rem' }}>
                  <span className="badge badge-crimson" style={{ fontSize: '0.68rem' }}>
                    {showtime?.format}
                  </span>
                </div>
              </div>
            </div>

            {/* Venue & Time */}
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.25rem', background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
              <div><strong style={{ color: '#fff' }}>{theatre?.name}</strong></div>
              <div>{date?.dayName}, {date?.month} {date?.dayNumber} at {showtime?.time}</div>
              <div style={{ color: 'var(--primary)', fontWeight: 600 }}>
                Seats: {seats.map((s) => s.id).join(', ')} ({seats.length} Tickets)
              </div>
              {snacks.length > 0 && (
                <div style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                  Snacks: {snacks.map((s) => `${s.quantity}× ${s.name}`).join(', ')}
                </div>
              )}
            </div>

            {/* Itemized Pricing */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Tickets Subtotal</span>
                <span>{formatCurrency(pricing.seatsSubtotal || pricing.subtotal)}</span>
              </div>
              {pricing.snacksSubtotal > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-gold)' }}>
                  <span>Concessions Subtotal</span>
                  <span>{formatCurrency(pricing.snacksSubtotal)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Convenience Fee (${1.50} × {seats.length})</span>
                <span>{formatCurrency(pricing.convenienceFee)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Entertainment Tax (8%)</span>
                <span>{formatCurrency(pricing.tax)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--border-light)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>Total Due</span>
                <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {formatCurrency(pricing.total)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-block btn-lg"
              style={{ gap: '0.65rem' }}
            >
              {isSubmitting ? (
                <>
                  <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  <span>Authorizing Demo Payment...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Confirm Booking ({formatCurrency(pricing.total)})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
