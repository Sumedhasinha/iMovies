// src/utils/dates.js
// Date generation & formatting utilities

/**
 * Generate next N days starting today
 */
export function getAvailableDates(daysCount = 7) {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < daysCount; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const isoDate = d.toISOString().split('T')[0]; // YYYY-MM-DD
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    const dayNumber = d.getDate();

    dates.push({
      isoDate,
      dayName,
      month,
      dayNumber,
      fullFormatted: d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
    });
  }

  return dates;
}

/**
 * Format ISO date string into human readable format
 */
export function formatFullDate(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString;
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}
