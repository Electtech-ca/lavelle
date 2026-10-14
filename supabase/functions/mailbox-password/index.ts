/* ──────────────────────────────────────────────────────────────
   Spa Rivier — change an @sparivier.ca mailbox's password from the
   admin portal (My Account ▸ Email password).

   POST with the signed-in admin's token and
     { email, current_password, new_password }

   The current password is checked by signing in to the mail server
   (SMTP, as a mail app would); only then is the new one set, through
   mailcow's API. Signed-in admins only, and only for the domain's own
   mailboxes, so the form cannot be used to guess passwords from
   outside.

   Configuration (container environment, see docker-compose.override.yml):
     MAILCOW_API_KEY — a read-write mailcow API key (mailcow ▸ System ▸
       Configuration ▸ Access ▸ API), from .env.certificates. mailcow
       must allow API calls from the server itself (its "allow API
       access from" list).
     MAILCOW_URL     — https://mail.sparivier.ca
     SMTP_HOST, SMTP_PORT — the mail server, as for the certificate email
   ────────────────────────────────────────────────────────────── */

import nodemailer from 'npm:nodemailer@6.9.16'
import { env, json, cors, adminFromRequest, errorText, MIN_PASSWORD } from '../_shared/admin.ts'

const DOMAIN      = 'sparivier.ca'
const MAILCOW_URL = env('MAILCOW_URL') || 'https://mail.sparivier.ca'
const API_KEY     = env('MAILCOW_API_KEY')

async function passwordWorks(email: string, password: string): Promise<boolean> {
  const port = Number(env('SMTP_PORT') || 465)
  const transport = nodemailer.createTransport({
    host: env('SMTP_HOST') || `mail.${DOMAIN}`, port, secure: port === 465,
    auth: { user: email, pass: password },
  })
  try { await transport.verify(); return true } catch { return false } finally { transport.close() }
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors(req) })
  if (req.method !== 'POST') return json(req, 405, { error: 'POST only' })

  const caller = await adminFromRequest(req)
  if (!caller) return json(req, 401, { error: 'Sign in to the admin portal as an admin first.' })
  if (!API_KEY) return json(req, 503, { error: 'Mailbox passwords cannot be changed here yet: the mail server key is not set up. Use the webmail settings instead.' })

  let body: { email?: string; current_password?: string; new_password?: string }
  try { body = await req.json() } catch { return json(req, 400, { error: 'Bad request' }) }

  const email = (body.email ?? '').trim().toLowerCase()
  const next = body.new_password ?? ''
  if (!email.endsWith(`@${DOMAIN}`)) return json(req, 400, { error: `Only @${DOMAIN} mailboxes can be changed here.` })
  if (next.length < MIN_PASSWORD) return json(req, 400, { error: `The new password needs at least ${MIN_PASSWORD} characters.` })
  if (next === body.current_password) return json(req, 400, { error: 'The new password is the same as the current one.' })

  if (!(await passwordWorks(email, body.current_password ?? ''))) {
    console.warn('[mailbox-password] wrong current password for', email, 'by', caller.email)
    return json(req, 403, { error: 'The current password for that mailbox is not right.' })
  }

  const res = await fetch(`${MAILCOW_URL}/api/v1/edit/mailbox`, {
    method: 'POST',
    headers: { 'X-API-Key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: [email], attr: { password: next, password2: next } }),
  })
  const result = res.ok ? await res.json() : null
  const failed = !res.ok || (Array.isArray(result) && result.some((r: { type?: string }) => r.type === 'danger' || r.type === 'error'))
  if (failed) {
    const reason = res.ok ? JSON.stringify(result) : await errorText(res)
    console.error('[mailbox-password] mailcow refused:', reason)
    return json(req, 502, { error: 'The mail server did not accept the new password. Try a longer one, or use the webmail settings.' })
  }
  console.log('[mailbox-password] changed for', email, 'by', caller.email)
  return json(req, 200, { ok: true })
})
