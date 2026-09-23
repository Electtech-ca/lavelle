/* ──────────────────────────────────────────────────────────────
   Spa Rivier — gift certificate delivery.

   Stripe calls this when a certificate Payment Link is paid
   (checkout.session.completed). It:

     1. verifies the call really came from Stripe (signing secret),
     2. finds the order the website saved, by certificate code — the
        site sends that code to Stripe as client_reference_id,
     3. marks the order active and records the amount actually paid
        (custom-amount certificates are saved with 0 until now),
     4. emails the certificate code to the recipient.

   Stripe retries a call until it gets a 2xx, so the order is claimed
   with a conditional update (pending → active) before anything is
   sent: a retry finds nothing left to claim and does not send twice.
   If the email fails the claim is released and a 500 asks Stripe to
   try again later.

   Configuration (container environment, see docker-compose.override.yml):
     STRIPE_WEBHOOK_SECRET, SMTP_PASSWORD   — from .env.certificates
     SMTP_HOST, SMTP_PORT, SMTP_USER, MAIL_FROM
     SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY — provided by Supabase
   ────────────────────────────────────────────────────────────── */

import nodemailer from 'npm:nodemailer@6.9.16'

const env = (k: string) => Deno.env.get(k) ?? ''

const STRIPE_SECRET = env('STRIPE_WEBHOOK_SECRET')
const DB_URL        = env('SUPABASE_URL')
const DB_KEY        = env('SUPABASE_SERVICE_ROLE_KEY')
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

/* ── Email ── */
const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))

const money = (cents: number) =>
  '$' + (cents / 100).toLocaleString('en-CA', { minimumFractionDigits: cents % 100 ? 2 : 0 })

function validUntil(): string {
  const d = new Date(); d.setFullYear(d.getFullYear() + 1)
  return d.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
}

function certificateEmail(o: { code: string; cents: number; recipientName: string; senderName: string; message: string }) {
  const amount = money(o.cents)
  const until = validUntil()
  const greeting = o.recipientName ? `Hi ${o.recipientName},` : 'Hello,'
  const fromLine = o.senderName ? `${o.senderName} has sent you` : 'You have received'

  const text = [
    greeting, '',
    `${fromLine} a Spa Rivier gift certificate worth ${amount}.`,
    ...(o.message ? ['', `"${o.message}"`] : []),
    '', `Your certificate code: ${o.code}`, '',
    'To use it, quote this code when you book, or show it at 353 Reid Street, Quesnel.',
    `Valid for all Spa Rivier services until ${until}.`, '',
    'Questions? Call us at 250-992-8084. Please do not reply to this email.',
    '', 'Spa Rivier · sparivier.ca',
  ].join('\n')

  const html = `<!doctype html><html><body style="margin:0;background:#f6f5ed;font-family:Helvetica,Arial,sans-serif;color:#2e3350">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f5ed;padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:14px;overflow:hidden">
  <tr><td style="background:#2e3350;padding:28px 32px">
    <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#e9b0b9">Gift Certificate</p>
    <p style="margin:6px 0 0;font-size:24px;color:#f6f5ed">Spa Rivier</p>
  </td></tr>
  <tr><td style="padding:32px">
    <p style="margin:0 0 14px;font-size:16px">${esc(greeting)}</p>
    <p style="margin:0 0 20px;font-size:16px;line-height:1.6">${esc(fromLine)} a Spa Rivier gift certificate worth <strong>${esc(amount)}</strong>.</p>
    ${o.message ? `<p style="margin:0 0 24px;padding:14px 18px;border-left:3px solid #e9b0b9;background:#faf6f1;font-style:italic;line-height:1.6;white-space:pre-wrap">${esc(o.message)}</p>` : ''}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px"><tr><td align="center" style="border:1px solid #e9b0b9;border-radius:10px;padding:20px">
      <p style="margin:0 0 6px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#8a8fa3">Your certificate code</p>
      <p style="margin:0;font-family:'Courier New',monospace;font-size:26px;font-weight:bold;letter-spacing:4px;color:#2e3350">${esc(o.code)}</p>
    </td></tr></table>
    <p style="margin:0 0 8px;font-size:14px;line-height:1.6">To use it, quote this code when you book, or show it at <strong>353 Reid Street, Quesnel</strong>.</p>
    <p style="margin:0 0 24px;font-size:14px;line-height:1.6">Valid for all Spa Rivier services until <strong>${esc(until)}</strong>.</p>
    <p style="margin:0;font-size:13px;color:#8a8fa3;line-height:1.6">Questions? Call <a href="tel:+12509928084" style="color:#2e3350">250-992-8084</a>. Please do not reply to this email.</p>
  </td></tr>
  <tr><td style="background:#faf6f1;padding:16px 32px;font-size:12px;color:#8a8fa3">Spa Rivier · 353 Reid Street, Quesnel BC · <a href="https://sparivier.ca" style="color:#8a8fa3">sparivier.ca</a></td></tr>
</table></td></tr></table></body></html>`

  return { subject: o.senderName ? `${o.senderName} sent you a Spa Rivier gift certificate` : 'Your Spa Rivier gift certificate', text, html }
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

  const code: string = session.client_reference_id ?? ''
  if (!/^LV-\d{4}-\d{4}$/.test(code)) return json(200, { ignored: 'not a certificate' })

  const cents: number = session.amount_total ?? 0
  const buyerEmail: string = session.customer_details?.email ?? ''

  // Claim the order: only a pending one flips to active, so retries do nothing.
  const [order] = await db(
    `gift_orders?cert_code=eq.${encodeURIComponent(code)}&type=eq.certificate&status=eq.pending`,
    { method: 'PATCH', body: JSON.stringify({ status: 'active', amount: cents }) },
  )

  if (!order) {
    const existing = await db(`gift_orders?cert_code=eq.${encodeURIComponent(code)}&select=status`)
    if (existing.length) {
      console.log(`[certificate] ${code} already delivered (${existing[0].status}); nothing to do`)
      return json(200, { alreadyDelivered: code })
    }
    // The website failed to save the order, so we have no recipient: send the
    // code to the buyer instead, so the certificate is never lost.
    console.warn(`[certificate] ${code} has no saved order — sending the code to the buyer`)
    if (buyerEmail) {
      const mail = certificateEmail({ code, cents, recipientName: '', senderName: '', message: '' })
      await mailer.sendMail({ from: env('MAIL_FROM'), to: buyerEmail, ...mail })
    }
    return json(200, { delivered: code, to: 'buyer (no saved order)' })
  }

  // Custom-amount certificates are saved at 0 until the payment says otherwise.
  if (!order.cert_amount) await db(`gift_orders?id=eq.${order.id}`, { method: 'PATCH', body: JSON.stringify({ cert_amount: cents }) })

  const to = order.recipient_email || order.sender_email || buyerEmail
  try {
    const mail = certificateEmail({ code, cents, recipientName: order.recipient_name, senderName: order.sender_name, message: order.message })
    await mailer.sendMail({ from: env('MAIL_FROM'), to, ...mail })
  } catch (err) {
    // Release the claim so Stripe's retry can deliver it.
    await db(`gift_orders?id=eq.${order.id}`, { method: 'PATCH', body: JSON.stringify({ status: 'pending' }) })
    console.error(`[certificate] ${code} email failed, will retry:`, err)
    return json(500, { error: 'email failed; Stripe will retry' })
  }

  console.log(`[certificate] ${code} (${money(cents)}) delivered to ${to}`)
  return json(200, { delivered: code })
})
