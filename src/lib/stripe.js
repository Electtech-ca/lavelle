/* ──────────────────────────────────────────────────────────────
   Stripe — gift certificates only.

   Card payment is deliberately limited to gift certificates. Cart
   orders (boutique, giftware) are reserved online and settled in
   store or by invoice, so no card details are ever collected for
   them. See Checkout.jsx.

   Certificates are paid through Stripe PAYMENT LINKS rather than a
   PaymentIntent, and that choice is a security one:

     · A PaymentIntent has to be created server-side with the secret
       key. This site is a static nginx container, so the key would
       have to live on the VPS — the same box that runs mailcow and
       self-hosted Supabase. A Payment Link needs no secret key
       anywhere in our infrastructure.
     · No Stripe JS is loaded either. The purchase is a plain
       redirect to checkout.stripe.com, so no third-party script
       ever runs on our origin and no card data passes through us.

   Set one link per denomination, created in the Stripe dashboard
   (Payments ▸ Payment Links), each with its success URL pointed at
      https://sparivier.ca/certificate-confirmed?session_id={CHECKOUT_SESSION_ID}
   Stripe substitutes the real session id into that placeholder.

   Until the links are set, isCertificatePaymentConfigured() is false
   and the certificate form falls back to recording the request for
   the spa to take payment by phone.
   ────────────────────────────────────────────────────────────── */

const env = import.meta.env

/* The seven denominations in giftsData.js → giftCertificates. */
export const CERT_AMOUNTS = [50, 100, 150, 200, 300, 500, 1000]

const isPlaceholder = (v) =>
  !v || v.includes('your-') || v.startsWith('your-') || v === 'placeholder'

/* Stripe serves Payment Links from these hosts and nowhere else. A link
   configured to point somewhere else is treated as unset rather than
   followed, so a bad value in .env can never redirect a paying guest
   off to an attacker's page. */
const LINK_HOST_PATTERN = /^(buy\.stripe\.com|checkout\.stripe\.com)$/i

function readLink(amount) {
  const raw = (env[`VITE_STRIPE_CERT_LINK_${amount}`] || '').trim()
  if (isPlaceholder(raw)) return null
  try {
    const url = new URL(raw)
    if (url.protocol !== 'https:') return null
    if (!LINK_HOST_PATTERN.test(url.hostname)) return null
    return url
  } catch {
    return null
  }
}

const LINKS = Object.fromEntries(
  CERT_AMOUNTS.map(amount => [amount, readLink(amount)])
)

/** True once every denomination has a valid Payment Link. */
export function isCertificatePaymentConfigured() {
  return CERT_AMOUNTS.every(amount => LINKS[amount] !== null)
}

/** True for one denomination — the grid can stay usable while links are added. */
export function hasCertificatePaymentLink(amount) {
  return LINKS[amount] != null
}

/**
 * The Stripe URL to send a buyer to for one certificate.
 *
 * `certCode` rides along as client_reference_id, which Stripe shows on the
 * payment and makes searchable in the dashboard. That is the link between
 * the Stripe payment and our gift_orders row, and because Stripe records it
 * at payment time it cannot be forged from the browser afterwards.
 */
export function certificatePaymentUrl(amount, { certCode, email } = {}) {
  const base = LINKS[amount]
  if (!base) return null

  const url = new URL(base.toString())
  if (certCode) url.searchParams.set('client_reference_id', certCode)
  if (email)    url.searchParams.set('prefilled_email', email)
  return url.toString()
}

/* ── Custom amounts ───────────────────────────────────────────────────────
   One extra Payment Link whose price is set to "customer chooses what to
   pay", so any value can be bought without a link per amount. The guest
   types the amount on Stripe's page, which is why nothing here carries one.
   Set VITE_STRIPE_CERT_LINK_CUSTOM to enable the block on the Giftware page.
   ─────────────────────────────────────────────────────────────────────── */
const CUSTOM_LINK = (() => {
  const raw = (env.VITE_STRIPE_CERT_LINK_CUSTOM || '').trim()
  if (isPlaceholder(raw)) return null
  try {
    const url = new URL(raw)
    if (url.protocol !== 'https:') return null
    if (!LINK_HOST_PATTERN.test(url.hostname)) return null
    return url
  } catch {
    return null
  }
})()

/** True once the "customer chooses the amount" Payment Link is set. */
export function hasCustomCertificateLink() {
  return CUSTOM_LINK != null
}

/** The Stripe URL for a custom-amount certificate. */
export function customCertificatePaymentUrl({ certCode, email } = {}) {
  if (!CUSTOM_LINK) return null
  const url = new URL(CUSTOM_LINK.toString())
  if (certCode) url.searchParams.set('client_reference_id', certCode)
  if (email)    url.searchParams.set('prefilled_email', email)
  return url.toString()
}

/** Exposed for the admin panel and diagnostics — never returns the URLs. */
export function certificatePaymentSummary() {
  return {
    configured: isCertificatePaymentConfigured(),
    missing: CERT_AMOUNTS.filter(a => LINKS[a] === null),
  }
}
