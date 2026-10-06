/* ──────────────────────────────────────────────────────────────
   Spa Rivier — gift certificate emails.

   Plain functions with no Deno or network calls, so the emails can be
   rendered and previewed outside the edge runtime.

   Each guest email carries the certificate itself as a card, drawn in its
   tier's colours (the palettes in src/data/giftsData.js) with the gift
   logo (public/email/gift-<tier>.png), the amount and the code, plus a
   button that opens the certificate on sparivier.ca to view or print.
   The spa's own copy (staffEmail) lists the code and the order instead.
   ────────────────────────────────────────────────────────────── */

export const SITE = 'https://sparivier.ca'

const SANS = "Poppins,'Helvetica Neue',Helvetica,Arial,sans-serif"
const MONO = "'Courier New',Courier,monospace"
const NAVY = '#2e3350'
const MUTED = '#8a8fa3'

/* Mirrors giftCertificates in src/data/giftsData.js. Borders there are
   rgba; email clients such as Outlook ignore alpha, so they are blended
   into solid colours below. */
const TIERS = [
  { amount: 50,   label: 'Rose Quartz',         subtitle: 'The Graceful Beginning',  stops: ['#f8e8f0', '#f0d0de', '#e8c4d2'], accent: '#a0506a', gold: '#c87890', text: '#6a2840', border: 'rgba(168,80,106,0.35)', dark: false },
  { amount: 100,  label: 'Champagne',           subtitle: 'The Signature Gift',      stops: ['#faf3e0', '#f0e0b0', '#e8d090'], accent: '#b83020', gold: '#c4a040', text: '#6a4a10', border: 'rgba(196,160,64,0.4)',  dark: false },
  { amount: 150,  label: 'Sage & Gold',         subtitle: 'The Serene Choice',       stops: ['#e8f4ec', '#c8e0d0', '#b0d0bc'], accent: '#3a7050', gold: '#5a9070', text: '#2a5038', border: 'rgba(90,144,112,0.35)', dark: false },
  { amount: 200,  label: 'Lavender Royale',     subtitle: 'The Elegant Statement',   stops: ['#f0eaf8', '#ddd0f0', '#c8b8e8'], accent: '#6040a0', gold: '#8060c0', text: '#3a2068', border: 'rgba(128,96,192,0.35)', dark: false },
  { amount: 300,  label: 'Imperial Plum',       subtitle: 'The Distinguished Gift',  stops: ['#313a4d', '#3a4560', '#2e3850'], accent: '#e43e2d', gold: '#f0d090', text: '#ffffff', border: 'rgba(228,62,45,0.45)',  dark: true },
  { amount: 500,  label: 'Midnight Diamond',    subtitle: "The Collector's Edition", stops: ['#0a0818', '#180a28', '#100818'], accent: '#e43e2d', gold: '#f5e0a0', text: '#ffffff', border: 'rgba(228,62,45,0.6)',   dark: true },
  { amount: 1000, label: 'Spa Rivier Prestige', subtitle: 'The Ultimate Experience', stops: ['#050510', '#0f0820', '#050510'], accent: '#f5e0a0', gold: '#ffffff', text: '#ffffff', border: 'rgba(245,224,160,0.7)', dark: true },
]

/* rgba(r,g,b,a) laid over a solid hex colour, as a solid hex colour. */
function blend(rgba: string, over: string): string {
  const [r, g, b, a] = rgba.match(/[\d.]+/g)!.map(Number)
  const base = [1, 3, 5].map(i => parseInt(over.slice(i, i + 2), 16))
  return '#' + [r, g, b].map((c, i) => Math.round(c * a + base[i] * (1 - a)).toString(16).padStart(2, '0')).join('')
}

/* The tier for a face value in dollars: its own tier for a standard amount,
   otherwise the colours of the nearest tier below, without its name. */
function tierFor(dollars: number) {
  const exact = TIERS.find(t => t.amount === dollars)
  const base = exact ?? [...TIERS].reverse().find(t => t.amount <= dollars) ?? TIERS[0]
  const bg = base.stops[1]
  return {
    ...base,
    label: exact ? base.label : null,
    subtitle: exact ? base.subtitle : null,
    bg,
    border: blend(base.border, bg),
    ink: base.dark ? base.gold : base.accent,          // gift logo and "Gift Certificate"
    title: base.dark ? '#f2f2f5' : base.text,
    small: base.dark ? blend('rgba(255,255,255,0.55)', bg) : base.accent,
    sub: base.dark ? blend('rgba(255,255,255,0.6)', bg) : base.accent,
    codeBg: blend(base.dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.55)', bg),
    badge: `${SITE}/email/gift-${base.amount}.png`,
  }
}

export const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))

export const money = (cents: number) =>
  '$' + (cents / 100).toLocaleString('en-CA', { minimumFractionDigits: cents % 100 ? 2 : 0, maximumFractionDigits: 2 })

/** The page that shows (and prints) one certificate. */
export const certificateLink = (code: string, token: string) =>
  `${SITE}/certificate?code=${encodeURIComponent(code)}&k=${encodeURIComponent(token)}`

type Cert = { code: string; cents: number; recipientName: string; senderName: string; message: string }

/* The certificate as an email card: table layout and inline styles only,
   with a solid background under the gradient for clients that drop it. */
function card(c: Cert): string {
  const t = tierFor(c.cents / 100)
  const title = !t.label ? 'Spa Rivier' : t.label.startsWith('Spa Rivier') ? t.label : `Spa Rivier ${t.label}`
  const cell = (label: string, value: string) => value ? `
        <td valign="top" style="padding:0 8px;font-family:${SANS}">
          <div style="font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${t.small}">${label}</div>
          <div style="padding-top:4px;font-size:17px;line-height:1.4;color:${t.dark ? '#ffffff' : t.text}">${esc(value)}</div>
        </td>` : ''
  const names = cell('To', c.recipientName) + cell('From', c.senderName)

  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${t.bg}" style="background-color:${t.bg};background-image:linear-gradient(135deg,${t.stops[0]} 0%,${t.stops[1]} 50%,${t.stops[2]} 100%);border:1px solid ${t.border};border-radius:16px">
  <tr><td align="center" style="padding:28px 16px 0">
    <img src="${t.badge}" width="56" height="56" alt="" style="display:block;border:0;width:56px;height:56px">
  </td></tr>
  <tr><td align="center" style="padding:12px 12px 0;font-family:${SANS};font-size:20px;font-weight:bold;letter-spacing:4px;text-transform:uppercase;color:${t.ink}">Gift Certificate</td></tr>
  <tr><td align="center" style="padding:6px 12px 0;font-family:${SANS};font-size:17px;font-style:italic;color:${t.title}">${esc(title)}</td></tr>
  <tr><td style="padding:20px 36px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid ${t.border};font-size:0;line-height:0">&nbsp;</td></tr></table></td></tr>
  <tr><td align="center" style="padding:20px 12px 0;font-family:${SANS};font-size:58px;font-weight:300;line-height:1;color:${t.accent}">${esc(money(c.cents))}</td></tr>
  ${t.subtitle ? `<tr><td align="center" style="padding:8px 12px 0;font-family:${SANS};font-size:13px;font-style:italic;color:${t.sub}">${esc(t.subtitle)}</td></tr>` : ''}
  <tr><td style="padding:22px 24px 0">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td align="center" bgcolor="${t.codeBg}" style="background-color:${t.codeBg};border:1px solid ${t.border};border-radius:10px;padding:14px 8px">
        <div style="font-family:${SANS};font-size:11px;font-weight:bold;letter-spacing:3px;text-transform:uppercase;color:${t.small}">Certificate code</div>
        <div style="padding-top:6px;font-family:${MONO};font-size:22px;font-weight:bold;letter-spacing:3px;color:${t.dark ? '#ffffff' : t.text}">${esc(c.code)}</div>
      </td>
    </tr></table>
  </td></tr>
  ${names ? `<tr><td style="padding:20px 16px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${names}</tr></table></td></tr>` : ''}
  ${c.message ? `<tr><td style="padding:16px 24px 0;font-family:${SANS}">
    <div style="font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${t.small}">Message</div>
    <div style="padding-top:4px;font-size:16px;font-style:italic;line-height:1.5;white-space:pre-wrap;color:${t.dark ? '#ffffff' : t.text}">${esc(c.message)}</div>
  </td></tr>` : ''}
  <tr><td style="padding:20px 36px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid ${t.border};font-size:0;line-height:0">&nbsp;</td></tr></table></td></tr>
  <tr><td align="center" style="padding:14px 16px 24px;font-family:${SANS};font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;line-height:1.8;color:${t.small}">
    Never expires &middot; <span style="white-space:nowrap">Services &amp; boutique</span><br>353 Reid Street, Quesnel &middot; <span style="white-space:nowrap">250-992-8084</span>
  </td></tr>
</table>`
}

function button(href: string, label: string): string {
  return `
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto"><tr>
  <td align="center" bgcolor="${NAVY}" style="background-color:${NAVY};border-radius:999px">
    <a href="${esc(href)}" style="display:inline-block;padding:14px 30px;font-family:${SANS};font-size:15px;font-weight:bold;letter-spacing:1px;color:#f6f5ed;text-decoration:none;border-radius:999px">${esc(label)}</a>
  </td>
</tr></table>`
}

/* How the guest emails end: how to use the certificate, and who to call. */
const HOW_TO_USE = `<p style="margin:0 0 10px">To use it, quote the code when you book, or bring the certificate to <strong>353 Reid Street, Quesnel</strong>. It is good for any Spa Rivier service or boutique purchase, and it never expires.</p>
    <p style="margin:0;font-size:13px;color:${MUTED}">Questions? Call <a href="tel:+12509928084" style="color:${NAVY}">250-992-8084</a>. Please do not reply to this email.</p>`

function page(o: { title: string; preheader: string; intro: string; body: string; link: string | null; buttonLabel: string; note: string }): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>${esc(o.title)}</title></head>
<body style="margin:0;padding:0;background:#f6f5ed">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#f6f5ed">${esc(o.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f5ed"><tr><td align="center" style="padding:28px 10px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden">
  <tr><td align="center" bgcolor="${NAVY}" style="background-color:${NAVY};padding:22px 24px 16px">
    <img src="${SITE}/email/logo.png" width="76" alt="Spa Rivier" style="display:block;border:0;width:76px;height:auto;color:#e9b0b9;font-family:${SANS};font-size:20px">
  </td></tr>
  <tr><td style="padding:28px 28px 4px;font-family:${SANS};font-size:16px;line-height:1.6;color:${NAVY}">${o.intro}</td></tr>
  <tr><td style="padding:16px 14px 4px">${o.body}</td></tr>
  ${o.link ? `<tr><td align="center" style="padding:20px 24px 4px">${button(o.link, o.buttonLabel)}</td></tr>` : ''}
  <tr><td style="padding:20px 28px 28px;font-family:${SANS};font-size:14px;line-height:1.6;color:${NAVY}">
    ${o.note}
  </td></tr>
  <tr><td style="background:#faf6f1;padding:16px 28px;font-family:${SANS};font-size:12px;color:${MUTED}">Spa Rivier &middot; 353 Reid Street, Quesnel BC &middot; <a href="${SITE}" style="color:${MUTED}">sparivier.ca</a></td></tr>
</table>
</td></tr></table>
</body></html>`
}

function plain(lines: (string | false | null | undefined)[]): string {
  return lines.filter(l => l !== false && l != null).join('\n')
}

/**
 * The email to whoever receives the certificate. `link` is null only when
 * the website failed to save the order, so there is no page to open.
 */
export function recipientEmail(c: Cert, link: string | null) {
  const amount = money(c.cents)
  const greeting = c.recipientName ? `Hi ${c.recipientName},` : 'Hello,'
  const fromLine = c.senderName ? `${c.senderName} has sent you` : 'You have received'
  const intro = `<p style="margin:0 0 10px">${esc(greeting)}</p>
    <p style="margin:0">${esc(fromLine)} a Spa Rivier gift certificate worth <strong>${esc(amount)}</strong>.</p>`

  return {
    subject: c.senderName ? `${c.senderName} sent you a Spa Rivier gift certificate` : 'Your Spa Rivier gift certificate',
    html: page({
      title: 'Your Spa Rivier gift certificate',
      preheader: `A Spa Rivier gift certificate worth ${amount}. It never expires.`,
      intro, body: card(c), link, buttonLabel: 'View & print your certificate', note: HOW_TO_USE,
    }),
    text: plain([
      greeting, '',
      `${fromLine} a Spa Rivier gift certificate worth ${amount}.`,
      c.message && '', c.message && `"${c.message}"`,
      '', `Certificate code: ${c.code}`,
      link && '', link && `View or print your certificate: ${link}`,
      '', 'To use it, quote the code when you book, or bring the certificate to 353 Reid Street, Quesnel.',
      'It is good for any Spa Rivier service or boutique purchase, and it never expires.', '',
      'Questions? Call us at 250-992-8084. Please do not reply to this email.',
      '', 'Spa Rivier · sparivier.ca',
    ]),
  }
}

/** The buyer's copy, to print and give in person or forward. */
export function buyerEmail(c: Cert, link: string, recipientAddress: string) {
  const amount = money(c.cents)
  const greeting = c.senderName ? `Hi ${c.senderName},` : 'Hello,'
  const forWhom = c.recipientName ? ` for ${c.recipientName}` : ''
  const intro = `<p style="margin:0 0 10px">${esc(greeting)}</p>
    <p style="margin:0">Thank you for your order. Here is your Spa Rivier gift certificate${esc(forWhom)}, worth <strong>${esc(amount)}</strong>.
    We have emailed it to <strong>${esc(recipientAddress)}</strong>, and this copy is yours to print and give in person.</p>`

  return {
    subject: `Your Spa Rivier gift certificate${forWhom}`,
    html: page({
      title: 'Your Spa Rivier gift certificate',
      preheader: `Your gift certificate${forWhom}, worth ${amount}, ready to print.`,
      intro, body: card(c), link, buttonLabel: 'View & print the certificate', note: HOW_TO_USE,
    }),
    text: plain([
      greeting, '',
      `Thank you for your order. Here is your Spa Rivier gift certificate${forWhom}, worth ${amount}.`,
      `We have emailed it to ${recipientAddress}, and this copy is yours to print and give in person.`,
      '', `Certificate code: ${c.code}`,
      '', `View or print the certificate: ${link}`,
      '', 'It is good for any Spa Rivier service or boutique purchase, and it never expires.', '',
      'Questions? Call us at 250-992-8084. Please do not reply to this email.',
      '', 'Spa Rivier · sparivier.ca',
    ]),
  }
}

type Sale = Cert & {
  recipientEmail: string
  senderEmail: string
  paidCents: number   // what Stripe charged, after any discount
  paidAt: Date
  payment: string     // Stripe's id for the payment, to find it in the dashboard
}

/* One labelled line of the spa's copy; a line with no value is left out. */
function detail(label: string, html: string): string {
  return html ? `
  <tr>
    <td valign="top" style="padding:7px 16px 7px 0;font-family:${SANS};font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;line-height:22px;color:${MUTED};white-space:nowrap">${label}</td>
    <td valign="top" style="padding:7px 0;font-family:${SANS};font-size:15px;line-height:22px;color:${NAVY};word-break:break-word">${html}</td>
  </tr>` : ''
}

/* A name over its email address, either of which may be missing. */
const person = (name: string, address: string) =>
  [name && esc(name), address && `<span style="color:${MUTED}">${esc(address)}</span>`].filter(Boolean).join('<br>')

const personText = (name: string, address: string) => name && address ? `${name} <${address}>` : name || address

/**
 * The spa's copy of a certificate paid online, so staff have every code on
 * file. `link` is null when the website failed to save the order: there are
 * then no names or message, and the certificate went to the buyer.
 */
export function staffEmail(s: Sale, link: string | null) {
  const amount = money(s.cents)
  const paid = s.paidCents !== s.cents ? money(s.paidCents) : ''
  const date = s.paidAt.toLocaleString('en-CA', { timeZone: 'America/Vancouver', dateStyle: 'long', timeStyle: 'short' })
  const unsaved = link ? '' : 'The website did not save this order, so it has no names or message. '
    + (s.recipientEmail ? 'The certificate was emailed to the buyer.' : 'Stripe gave no email address for the buyer, so the certificate was not emailed to anyone.')
  const intro = `<p style="margin:0">A gift certificate worth <strong>${esc(amount)}</strong> was paid for on sparivier.ca.</p>`
    + (unsaved ? `<p style="margin:10px 0 0">${esc(unsaved)}</p>` : '')

  const body = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
  <td align="center" bgcolor="#faf6f1" style="background-color:#faf6f1;border:1px solid #e8e1d6;border-radius:10px;padding:14px 8px">
    <div style="font-family:${SANS};font-size:11px;font-weight:bold;letter-spacing:3px;text-transform:uppercase;color:${MUTED}">Certificate code</div>
    <div style="padding-top:6px;font-family:${MONO};font-size:26px;font-weight:bold;letter-spacing:3px;color:${NAVY}">${esc(s.code)}</div>
  </td>
</tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px">
  ${detail('Value', esc(amount))}
  ${detail('Paid', esc(paid))}
  ${detail('Date', esc(date))}
  ${detail('To', person(s.recipientName, s.recipientEmail))}
  ${detail('From', person(s.senderName, s.senderEmail))}
  ${detail('Message', s.message && `<span style="font-style:italic;white-space:pre-wrap">${esc(s.message)}</span>`)}
  ${detail('Stripe', s.payment && `<span style="font-family:${MONO};font-size:13px;color:${MUTED}">${esc(s.payment)}</span>`)}
</table>`

  const line = (label: string, value: string) => value ? `${label}: ${value}` : null
  return {
    subject: `Gift certificate sold: ${s.code} (${amount})`,
    html: page({
      title: `Gift certificate ${s.code}`,
      preheader: `${s.code}, worth ${amount}${s.recipientName ? `, for ${s.recipientName}` : ''}.`,
      intro, body, link, buttonLabel: 'View the certificate',
      note: `<p style="margin:0;font-size:13px;color:${MUTED}">Sent automatically by sparivier.ca for each gift certificate paid online, so the spa has every code on file.</p>`,
    }),
    text: plain([
      `A gift certificate worth ${amount} was paid for on sparivier.ca.`,
      unsaved ? '' : null, unsaved || null,
      '', line('Certificate code', s.code),
      line('Value', amount), line('Paid', paid), line('Date', date),
      line('To', personText(s.recipientName, s.recipientEmail)),
      line('From', personText(s.senderName, s.senderEmail)),
      line('Message', s.message && `"${s.message}"`),
      line('Stripe', s.payment),
      link ? '' : null, line('View the certificate', link ?? ''),
      '', 'Sent automatically by sparivier.ca for each gift certificate paid online, so the spa has every code on file.',
    ]),
  }
}
