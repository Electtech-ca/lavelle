/* ──────────────────────────────────────────────────────────────
   Spa Rivier — gift certificate delivery.

   Stripe calls this when a certificate Payment Link is paid
   (checkout.session.completed). It:

     1. verifies the call really came from Stripe (signing secret),
     2. finds the order the website saved. The site sends Stripe
        "<certificate code>_<view token>" as client_reference_id and
        only the order holding both is taken, so an order row someone
        else created with the same code can never receive this payment,
     3. marks the order active and records what Stripe charged: the
        face value (before any discount) and the amount paid,
     4. emails the certificate to the recipient, and a copy to the
        buyer to print. Each shows the certificate as a card and links
        to it on sparivier.ca to view or print (see email.ts),
     5. emails the spa (STAFF_EMAIL) the code and the order, so staff
        have every certificate sold on file.

   Stripe retries a call until it gets a 2xx, so the order is claimed
   with a conditional update (pending → active) before anything is
   sent: a retry finds nothing left to claim and does not send twice.
   If the recipient's email fails the claim is released and a 500 asks
   Stripe to try again later. The buyer's copy is best effort, since the
   buyer also saw the certificate on the page after payment, and so is
   the spa's, since the order is in the database and Stripe either way.

   Configuration (container environment, see docker-compose.override.yml):
     STRIPE_WEBHOOK_SECRET, SMTP_PASSWORD   — from .env.certificates
     SMTP_HOST, SMTP_PORT, SMTP_USER, MAIL_FROM, STAFF_EMAIL
     SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY — provided by Supabase
   ────────────────────────────────────────────────────────────── */

import nodemailer from 'npm:nodemailer@6.9.16'
import { certificateLink, recipientEmail, buyerEmail, staffEmail, money } from './email.ts'

const env = (k: string) => Deno.env.get(k) ?? ''

const STRIPE_SECRET = env('STRIPE_WEBHOOK_SECRET')
const DB_URL        = env('SUPABASE_URL')
const DB_KEY        = env('SUPABASE_SERVICE_ROLE_KEY')
const STAFF_EMAIL   = env('STAFF_EMAIL')   // the spa's copy of every certificate sold
const TOLERANCE_S   = 300   // reject signatures older than Stripe's recommended 5 minutes

const mailer = nodemailer.createTransport({
  host: env('SMTP_HOST'),
  port: Number(env('SMTP_PORT') || 465),
  secure: Number(env('SMTP_PORT') || 465) === 465,
  auth: { user: env('SMTP_USER'), pass: env('SMTP_PASSWORD') },
})

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

/* ── Stripe signature: HMAC-SHA256 over "<timestamp>.<raw body>" ── */
async function verifyStripe(raw: string, header: string | null): Promise<boolean> {
  if (!header || !STRIPE_SECRET) return false
  const parts = header.split(',').map(p => p.split('='))
  const t = parts.find(([k]) => k === 't')?.[1]
  const sigs = parts.filter(([k]) => k === 'v1').map(([, v]) => v)
  if (!t || sigs.length === 0) return false
  if (Math.abs(Date.now() / 1000 - Number(t)) > TOLERANCE_S) return false

  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(STRIPE_SECRET),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  )
  const mac = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${t}.${raw}`)))
  const expected = Array.from(mac, b => b.toString(16).padStart(2, '0')).join('')
  return sigs.some(sig => timingSafeEqual(sig, expected))
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

/* ── Database, through PostgREST with the service role ── */
async function db(path: string, init: RequestInit = {}) {
  const res = await fetch(`${DB_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: DB_KEY, Authorization: `Bearer ${DB_KEY}`,
      'Content-Type': 'application/json', Prefer: 'return=representation',
      ...(init.headers ?? {}),
    },
  })
  if (!res.ok) throw new Error(`db ${res.status}: ${await res.text()}`)
  return res.json()
}

/* client_reference_id is "LV-0100-4823_<token>". A purchase started on an
   older copy of the site sends the code alone. */
const REFERENCE = /^(LV-\d{4}-\d{4})(?:_([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}))?$/i

const sameAddress = (a?: string | null, b?: string | null) =>
  (a ?? '').trim().toLowerCase() === (b ?? '').trim().toLowerCase()

/* The spa's copy, with the code. Best effort: a failure is logged, and the
   order stays in gift_orders and the payment in Stripe. */
async function tellSpa(mail: { subject: string; html: string; text: string }, code: string): Promise<boolean> {
  if (!STAFF_EMAIL) {
    console.warn(`[certificate] ${code}: STAFF_EMAIL is not set, so the spa was not sent the code`)
    return false
  }
  try {
    await mailer.sendMail({ from: env('MAIL_FROM'), to: STAFF_EMAIL, ...mail })
    return true
  } catch (err) {
    console.error(`[certificate] ${code} spa's copy to ${STAFF_EMAIL} failed:`, err)
    return false
  }
}

/* ── Handler ── */
const HANDLED = new Set(['checkout.session.completed', 'checkout.session.async_payment_succeeded'])

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'POST only' })

  const raw = await req.text()
  if (!(await verifyStripe(raw, req.headers.get('stripe-signature')))) {
    console.warn('[certificate] rejected: bad or missing Stripe signature')
    return json(400, { error: 'invalid signature' })
  }

  const event = JSON.parse(raw)
  if (!HANDLED.has(event.type)) return json(200, { ignored: event.type })

  const session = event.data?.object ?? {}
  if (session.payment_status !== 'paid') return json(200, { ignored: 'not paid yet' })

  const ref = REFERENCE.exec(session.client_reference_id ?? '')
  if (!ref) return json(200, { ignored: 'not a certificate' })
  const code  = ref[1]
  const token = ref[2]?.toLowerCase() ?? null

  const paid: number = session.amount_total ?? 0
  const face: number = session.amount_subtotal ?? paid     // before any discount: what the certificate is worth
  const buyer: string = session.customer_details?.email ?? ''
  const paidAt = new Date((event.created ?? Date.now() / 1000) * 1000)
  const payment: string = session.payment_intent ?? session.id ?? ''   // what the Stripe dashboard finds it by

  const match = `cert_code=eq.${encodeURIComponent(code)}&type=eq.certificate` + (token ? `&view_token=eq.${token}` : '')

  // Claim the order: only a pending one flips to active, so retries do nothing.
  const [order] = await db(`gift_orders?${match}&status=eq.pending`, {
    method: 'PATCH', body: JSON.stringify({ status: 'active', amount: paid, cert_amount: face }),
  })

  if (!order) {
    const existing = await db(`gift_orders?${match}&select=status`)
    if (existing.length) {
      console.log(`[certificate] ${code} already delivered (${existing[0].status}); nothing to do`)
      return json(200, { alreadyDelivered: code })
    }
    // The website failed to save the order, so there is no recipient and no
    // certificate page: send the certificate to the buyer, so it is never lost.
    console.warn(`[certificate] ${code} has no saved order — sending the certificate to the buyer`)
    if (buyer) {
      const mail = recipientEmail({ code, cents: face, recipientName: '', senderName: '', message: '' }, null)
      await mailer.sendMail({ from: env('MAIL_FROM'), to: buyer, ...mail })
    }
    await tellSpa(staffEmail({
      code, cents: face, recipientName: '', senderName: '', message: '',
      recipientEmail: buyer, senderEmail: '', paidCents: paid, paidAt, payment,
    }, null), code)
    return json(200, { delivered: code, to: 'buyer (no saved order)' })
  }

  const cert = {
    code, cents: face,
    recipientName: order.recipient_name ?? '', senderName: order.sender_name ?? '', message: order.message ?? '',
  }
  const link = certificateLink(code, order.view_token)
  const to = order.recipient_email || order.sender_email || buyer
  try {
    await mailer.sendMail({ from: env('MAIL_FROM'), to, ...recipientEmail(cert, link) })
  } catch (err) {
    // Release the claim so Stripe's retry can deliver it.
    await db(`gift_orders?id=eq.${order.id}`, { method: 'PATCH', body: JSON.stringify({ status: 'pending' }) })
    console.error(`[certificate] ${code} email failed, will retry:`, err)
    return json(500, { error: 'email failed; Stripe will retry' })
  }

  // The buyer's copy to print, unless the buyer is the recipient.
  const copyTo = order.sender_email || buyer
  const sendCopy = Boolean(copyTo) && !sameAddress(copyTo, to)
  if (sendCopy) {
    try {
      await mailer.sendMail({ from: env('MAIL_FROM'), to: copyTo, ...buyerEmail(cert, link, to) })
    } catch (err) {
      console.error(`[certificate] ${code} buyer's copy to ${copyTo} failed (the recipient has theirs):`, err)
    }
  }

  const told = await tellSpa(staffEmail({
    ...cert, recipientEmail: to, senderEmail: copyTo, paidCents: paid, paidAt, payment,
  }, link), code)

  console.log(`[certificate] ${code} (${money(face)}) delivered to ${to}${sendCopy ? `, copy to ${copyTo}` : ''}${told ? `, spa's copy to ${STAFF_EMAIL}` : ''}`)
  return json(200, { delivered: code })
})
