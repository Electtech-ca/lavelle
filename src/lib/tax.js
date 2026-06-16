/* ─────────────────────────────────────────────────────────────
   Sparivier Tax Calculation Utility
   All prices stored and computed in CENTS (integer) to avoid
   floating-point errors. Round only at display time.

   Default: British Columbia, Canada
     PST = 7%   (Provincial Sales Tax)
     GST = 5%   (Goods and Services Tax — federal)
     Total tax = 12% of pre-tax subtotal

   Override via environment variables for other jurisdictions.
──────────────────────────────────────────────────────────── */

export const PST_RATE  = parseFloat(import.meta.env.VITE_PST_RATE  ?? 0.07)
export const GST_RATE  = parseFloat(import.meta.env.VITE_GST_RATE  ?? 0.05)
export const CURRENCY  = import.meta.env.VITE_CURRENCY ?? 'CAD'
export const LOCALE    = import.meta.env.VITE_CURRENCY_LOCALE ?? 'en-CA'
export const PROVINCE  = import.meta.env.VITE_TAX_PROVINCE ?? 'BC'

/**
 * Calculate tax breakdown from a subtotal in cents.
 * @param {number} subtotalCents  Integer — subtotal before tax
 * @returns {{ pst, gst, total, grandTotal }} all in cents (integers)
 */
export function calcTax(subtotalCents) {
  const pst       = Math.round(subtotalCents * PST_RATE)
  const gst       = Math.round(subtotalCents * GST_RATE)
  const total     = pst + gst
  const grandTotal = subtotalCents + total
  return { pst, gst, total, grandTotal }
}

/**
 * Format cents as a currency string.
 * e.g. 58200 → "$582.00"
 */
export function formatMoney(cents) {
  return new Intl.NumberFormat(LOCALE, {
    style:    'currency',
    currency: CURRENCY,
    minimumFractionDigits: 2,
  }).format(cents / 100)
}

/**
 * Parse a price string like "$582" or "From $180" into cents.
 */
export function parsePriceCents(str) {
  if (!str) return 0
  const n = parseFloat(str.replace(/[^0-9.]/g, ''))
  return isNaN(n) ? 0 : Math.round(n * 100)
}
