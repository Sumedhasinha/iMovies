// server/src/utils/pricingCalculator.js

export const FEE_PER_TICKET = 1.50; // $1.50 convenience fee per ticket
export const TAX_RATE = 0.08; // 8% Service & Entertainment Tax

export const SEAT_TIERS = {
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

/**
 * Calculates accurate server-side pricing for requested seats and optional snacks
 * @param {Array} seats - array of seat objects [{ id: 'E6', ... }]
 * @param {Object} showtimePrices - { standard: 14, premium: 19, vip: 26 }
 * @param {Array} snacks - optional array of snacks [{ id, name, price, quantity }]
 */
export function calculateServerPricing(seats = [], showtimePrices = {}, snacks = []) {
  if (!Array.isArray(seats) || seats.length === 0) {
    throw new Error('At least one seat is required for price calculation.');
  }

  const prices = {
    standard: showtimePrices.standard || 14.0,
    premium: showtimePrices.premium || 18.0,
    vip: showtimePrices.vip || 25.0
  };

  let seatsSubtotal = 0;
  const validatedSeats = [];
  const tierBreakdown = {
    standard: { count: 0, price: prices.standard, subtotal: 0 },
    premium: { count: 0, price: prices.premium, subtotal: 0 },
    vip: { count: 0, price: prices.vip, subtotal: 0 }
  };

  for (const s of seats) {
    const seatId = typeof s === 'string' ? s.toUpperCase() : s.id.toUpperCase();
    const rowLetter = seatId.charAt(0);
    const colNumber = parseInt(seatId.slice(1), 10);

    const tier = SEAT_TIERS[rowLetter] || 'standard';
    const price = prices[tier];

    seatsSubtotal += price;

    tierBreakdown[tier].count += 1;
    tierBreakdown[tier].subtotal = Number((tierBreakdown[tier].subtotal + price).toFixed(2));

    validatedSeats.push({
      id: seatId,
      row: rowLetter,
      number: colNumber,
      tier,
      price
    });
  }

  // Calculate snacks subtotal
  let snacksSubtotal = 0;
  const validatedSnacks = [];

  if (Array.isArray(snacks)) {
    for (const sn of snacks) {
      const qty = Math.max(1, parseInt(sn.quantity, 10) || 1);
      const price = Math.max(0, parseFloat(sn.price) || 0);
      const itemSubtotal = Number((price * qty).toFixed(2));
      snacksSubtotal += itemSubtotal;

      validatedSnacks.push({
        id: sn.id || 'snack',
        name: sn.name || 'Concession Item',
        price,
        quantity: qty
      });
    }
  }

  const subtotal = Number((seatsSubtotal + snacksSubtotal).toFixed(2));
  const convenienceFee = Number((seats.length * FEE_PER_TICKET).toFixed(2));
  const taxableAmount = subtotal + convenienceFee;
  const tax = Number((taxableAmount * TAX_RATE).toFixed(2));
  const total = Number((subtotal + convenienceFee + tax).toFixed(2));

  return {
    validatedSeats,
    validatedSnacks,
    pricing: {
      seatCount: seats.length,
      seatsSubtotal: Number(seatsSubtotal.toFixed(2)),
      snacksSubtotal: Number(snacksSubtotal.toFixed(2)),
      subtotal,
      convenienceFee,
      tax,
      total,
      tierBreakdown
    }
  };
}
