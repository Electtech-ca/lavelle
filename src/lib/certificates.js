/* ──────────────────────────────────────────────────────────────
   Gift certificate identity: the code the spa redeems, and the
   private token that opens the certificate online.

   The code (LV-0100-4823) stays short so it can be read out over the
   phone. The token is a random UUID nobody has to type; it rides in
   the certificate link that is emailed after payment.

   Both are made in the buyer's browser, saved with the order, and sent
   to Stripe together as client_reference_id ("<code>_<token>"). The
   webhook activates only the order holding BOTH, so an order row that
   someone else created with the same code can never pick up this
   payment's certificate.
   ────────────────────────────────────────────────────────────── */

import { supabase } from './supabase'

export function newCertificateCode(amount) {
  const n = new Uint32Array(1)
  crypto.getRandomValues(n)
  return `LV-${String(amount).padStart(4, '0')}-${1000 + (n[0] % 9000)}`
}

export function newViewToken() {
  if (crypto.randomUUID) return crypto.randomUUID()
  const b = new Uint8Array(16)
  crypto.getRandomValues(b)
  b[6] = (b[6] & 0x0f) | 0x40
  b[8] = (b[8] & 0x3f) | 0x80
  const h = Array.from(b, x => x.toString(16).padStart(2, '0')).join('')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

/** What Stripe carries as client_reference_id (letters, digits, - and _ only). */
export const paymentReference = (code, token) => `${code}_${token}`

const CODE_RE  = /^LV-\d{4}-\d{4}$/
const TOKEN_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * The certificate as the spa has it on file, or null when the code and
 * token do not match one. `face_cents` is the value Stripe charged, which
 * the webhook records, so custom amounts show their real value.
 */
export async function fetchCertificate(code, token) {
  if (!CODE_RE.test(code || '') || !TOKEN_RE.test(token || '')) return null
  if (!supabase) throw new Error('database not configured')
  const { data, error } = await supabase.rpc('certificate_view', { p_code: code, p_token: token })
  if (error) throw error
  return data?.[0] ?? null
}
