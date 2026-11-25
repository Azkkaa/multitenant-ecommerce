/**
 * Utility functions for currency and numerical formatting.
 */

/**
 * Format a number into Indonesian Rupiah format (e.g. Rp 25.000)
 * @param {number|string} amount
 * @returns {string} Formatted IDR string
 */
export function formatIDR(amount) {
  const numeric = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  return `Rp ${Math.round(numeric).toLocaleString('id-ID')}`;
}
