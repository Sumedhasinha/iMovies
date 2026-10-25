// server/src/utils/generateBookingReference.js
import crypto from 'crypto';

/**
 * Generates an uppercase unique reference code for tickets, e.g., "IMV-839201"
 */
export function generateBookingReference() {
  const randomNum = crypto.randomInt(100000, 999999);
  return `IMV-${randomNum}`;
}
