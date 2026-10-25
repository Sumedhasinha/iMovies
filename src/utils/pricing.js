// src/utils/pricing.js
// Calculation utilities for cinema bookings, fees, and formatting

export const FEE_PER_TICKET = 1.50; // Convenience fee per seat
export const TAX_RATE = 0.08; // 8% Service & Entertainment Tax

export const SEAT_TIER_CONFIG = {
  standard: {
    label: 'Standard',
    code: 'STD',
    desc: 'Ergonomic plush cinema seating with Dolby surround',
    defaultPrice: 13.50,
    color: '#38bdf8'
  },
  premium: {
    label: 'Premium',
    code: 'PRM',
    desc: 'Prime central viewing angles with extended legroom',
    defaultPrice: 17.50,
    color: '#f59e0b'
  },
  vip: {
    label: 'VIP Recliner',
    code: 'VIP',
    desc: 'Motorized zero-gravity luxury leather recliner + table',
    defaultPrice: 24.00,
    color: '#a855f7'
  }
};

/**
 * Calculate full pricing breakdown
 * @param {Array} seats - array of seat objects e.g. [{ id: 'E5', row: 'E', number: 5, tier: 'premium', price: 17.5 }]
 * @param {Array} snacks - array of snack objects e.g. [{ id: 'snack-1', name: 'Truffle Popcorn', price: 8.5, quantity: 1 }]
 */
export function calculateBookingPrice(seats = [], snacks = []) {
  const seatCount = Array.isArray(seats) ? seats.length : 0;
  let seatsSubtotal = 0;
  const tierBreakdown = {
    standard: { count: 0, price: 0, subtotal: 0 },
    premium: { count: 0, price: 0, subtotal: 0 },
    vip: { count: 0, price: 0, subtotal: 0 }
  };

  if (seatCount > 0) {
    seats.forEach((seat) => {
      const tier = seat.tier || 'standard';
      const price = typeof seat.price === 'number' ? seat.price : SEAT_TIER_CONFIG[tier]?.defaultPrice || 13.50;
      seatsSubtotal += price;

      if (!tierBreakdown[tier]) {
        tierBreakdown[tier] = { count: 0, price, subtotal: 0 };
      }
      tierBreakdown[tier].count += 1;
      tierBreakdown[tier].price = price;
      tierBreakdown[tier].subtotal += price;
    });
  }

  // Calculate snacks total
  let snacksSubtotal = 0;
  if (Array.isArray(snacks)) {
    snacks.forEach((snack) => {
      const qty = snack.quantity || 1;
      const price = typeof snack.price === 'number' ? snack.price : 0;
      snacksSubtotal += price * qty;
    });
  }

  const subtotal = seatsSubtotal + snacksSubtotal;
  const convenienceFee = seatCount * FEE_PER_TICKET;
  const taxableAmount = subtotal + convenienceFee;
  const tax = Number((taxableAmount * TAX_RATE).toFixed(2));
  const total = Number((subtotal + convenienceFee + tax).toFixed(2));

  return {
    seatCount,
    seatsSubtotal: Number(seatsSubtotal.toFixed(2)),
    snacksSubtotal: Number(snacksSubtotal.toFixed(2)),
    subtotal: Number(subtotal.toFixed(2)),
    convenienceFee: Number(convenienceFee.toFixed(2)),
    tax,
    total,
    tierBreakdown
  };
}

export function formatCurrency(amount) {
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
}
