import { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { callAdminFunction, MIN_PASSWORD } from '../../lib/adminFunctions'
import { startStudioSession, STUDIO_URL } from '../../lib/studioSession'
import { KeyRound, Database, Mail, ExternalLink, Eye, EyeOff } from 'lucide-react'
import { Notice, DevModeNotice, card, inputStyle, labelStyle, hintStyle } from './adminUi'

/* ──────────────────────────────────────────────────────────────
   Admin ▸ My Account — the signed-in admin's passwords:
     • the admin portal password, which also opens Supabase Studio;
     • Supabase Studio, opened with that same login (studio-gate);
     • an @sparivier.ca mailbox password (mailbox-password function).
   ────────────────────────────────────────────────────────────── */

const WEBMAIL_SETTINGS = import.meta.env.VITE_MAILBOX_SETTINGS_URL || 'https://mail.sparivier.ca/'

function PasswordInput({ value, onChange, autoComplete, id }) {
  const [shown, setShown] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <input id={id} type={shown ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)} autoComplete={autoComplete}
        style={{ ...inputStyle(false), paddingRight: '42px' }} />
      <button type="button" onClick={() => setShown(s => !s)} aria-label={shown ? 'Hide password' : 'Show password'}
        style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--lavelle-gray-mid)', display: 'flex' }}>
        {shown ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
}

/* New password twice; returns an error message or ''. */
function checkNew(next, again, current) {
  if (next.length < MIN_PASSWORD) return `The new password needs at least ${MIN_PASSWORD} characters.`
  if (next !== again) return 'The two new passwords are not the same.'
  if (next === current) return 'The new password is the same as the current one.'
  return ''
}

function Section({ icon: Icon, title, children }) {
  return (
    <section style={{ ...card, padding: 'var(--space-xl)', maxWidth: '640px' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)', marginBottom: 'var(--space-md)' }}>
        <Icon size={18} /> {title}
      </h2>
      {children}
    </section>
  )
}

const para = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', lineHeight: 1.7, marginBottom: 'var(--space-lg)' }
const grid = { display: 'grid', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }

export default function AdminAccount() {
  const { user } = useAuth()
  const email = user?.email || ''

  // Admin portal password
  const [pw, setPw] = useState({ current: '', next: '', again: '' })
  const [pwBusy, setPwBusy] = useState(false)
  const [pwMsg, setPwMsg] = useState({ text: '', ok: false })

  async function changePortalPassword(e) {
    e.preventDefault()
    const problem = checkNew(pw.next, pw.again, pw.current)
    if (problem) { setPwMsg({ text: problem, ok: false }); return }
    setPwBusy(true); setPwMsg({ text: '', ok: false })
    // The current password first, so an unattended session can't change it.
    const check = await supabase.auth.signInWithPassword({ email, password: pw.current })
    if (check.error) {
      setPwBusy(false); setPwMsg({ text: 'Your current password is not right.', ok: false }); return
    }
    const { error } = await supabase.auth.updateUser({ password: pw.next })
    setPwBusy(false)
    if (error) setPwMsg({ text: 'Not changed: ' + error.message, ok: false })
    else {
      setPw({ current: '', next: '', again: '' })
      setPwMsg({ text: 'Your password is changed. Use the new one next time you sign in to the admin portal or Supabase Studio.', ok: true })
    }
  }

  // Supabase Studio
  const [studio, setStudio] = useState(null)       // null while loading, then true / false
  const [studioMsg, setStudioMsg] = useState('')
  useEffect(() => {
    if (!supabase || !user) return
    supabase.from('profiles').select('studio_access').eq('id', user.id).maybeSingle()
      .then(({ data, error }) => setStudio(error ? false : Boolean(data?.studio_access)))
  }, [user])

  async function openStudio() {
    setStudioMsg('')
    const tab = window.open('about:blank', '_blank')
    if (await startStudioSession()) {
      if (tab) tab.location.href = STUDIO_URL
      else window.location.href = STUDIO_URL
    } else {
      tab?.close()
      setStudioMsg('Your session has ended. Sign in again, then open Studio.')
    }
  }

  // Mailbox password
  const [mail, setMail] = useState({ email: '', current: '', next: '', again: '' })
  const [mailBusy, setMailBusy] = useState(false)
  const [mailMsg, setMailMsg] = useState({ text: '', ok: false })
  useEffect(() => { if (email.endsWith('@sparivier.ca')) setMail(m => ({ ...m, email: m.email || email })) }, [email])

  async function changeMailboxPassword(e) {
    e.preventDefault()
    if (!mail.email.trim().toLowerCase().endsWith('@sparivier.ca')) { setMailMsg({ text: 'Enter an @sparivier.ca email address.', ok: false }); return }
    const problem = checkNew(mail.next, mail.again, mail.current)
    if (problem) { setMailMsg({ text: problem, ok: false }); return }
    setMailBusy(true); setMailMsg({ text: '', ok: false })
    try {
      await callAdminFunction('mailbox-password', { email: mail.email, current_password: mail.current, new_password: mail.next })
      setMail(m => ({ ...m, current: '', next: '', again: '' }))
      setMailMsg({ text: `The password for ${mail.email} is changed. Update it in any phone or computer mail app that uses this mailbox.`, ok: true })
    } catch (err) {
      setMailMsg({ text: err.message, ok: false })
    }
    setMailBusy(false)
  }

  const field = (label, id, control, hint) => (
    <div>
      <label htmlFor={id} style={labelStyle}>{label}</label>
      {control}
      {hint && <p style={hintStyle}>{hint}</p>}
    </div>
  )

  return (
    <AdminLayout title="My Account">
      {!supabase && <DevModeNotice />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>

        <Section icon={KeyRound} title="Admin portal password">
          <p style={para}>
            You are signed in as <strong>{email}</strong>. This password opens the admin portal and Supabase Studio.
          </p>
          <form onSubmit={changePortalPassword}>
            <input type="text" name="username" value={email} readOnly autoComplete="username" hidden />
            <div style={grid}>
              {field('Current password', 'pw-current', <PasswordInput id="pw-current" value={pw.current} onChange={v => setPw(p => ({ ...p, current: v }))} autoComplete="current-password" />)}
              {field('New password', 'pw-next', <PasswordInput id="pw-next" value={pw.next} onChange={v => setPw(p => ({ ...p, next: v }))} autoComplete="new-password" />,
                `At least ${MIN_PASSWORD} characters. A short sentence is easy to remember and hard to guess.`)}
              {field('New password again', 'pw-again', <PasswordInput id="pw-again" value={pw.again} onChange={v => setPw(p => ({ ...p, again: v }))} autoComplete="new-password" />)}
            </div>
            <Notice text={pwMsg.text} ok={pwMsg.ok} />
            <button type="submit" className="btn-primary" disabled={pwBusy || !supabase} style={{ fontSize: '0.8rem' }}>
              {pwBusy ? 'Changing…' : 'Change Password'}
            </button>
          </form>
        </Section>

        <Section icon={Database} title="Supabase Studio">
          <p style={para}>
            Supabase Studio is the database's own control panel. It opens with your admin portal login, so there is
            no separate Studio password: change the password above and it changes for Studio too.
          </p>
          {studio === null ? (
            <p style={hintStyle}>Checking your access…</p>
          ) : studio ? (
            <button type="button" onClick={openStudio} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
              Open Supabase Studio <ExternalLink size={14} />
            </button>
          ) : (
            <p style={{ ...para, marginBottom: 0, color: 'var(--lavelle-gray-mid)' }}>
              Your account cannot open Studio. An admin who has Studio access can give it to you on the Admin Users page.
            </p>
          )}
          <Notice text={studioMsg} />
        </Section>

        <Section icon={Mail} title="Email password">
          <p style={para}>
            Change the password of an @sparivier.ca mailbox. You need its current password. Mail apps on phones and
            computers that use the mailbox will ask for the new one. Forgotten passwords are reset by Elect Technologies.
          </p>
          <form onSubmit={changeMailboxPassword}>
            <div style={grid}>
              {field('Mailbox', 'mail-email', <input id="mail-email" type="email" value={mail.email} onChange={e => setMail(m => ({ ...m, email: e.target.value }))} placeholder="info@sparivier.ca" autoComplete="off" style={inputStyle(false)} />)}
              {field('Current mailbox password', 'mail-current', <PasswordInput id="mail-current" value={mail.current} onChange={v => setMail(m => ({ ...m, current: v }))} autoComplete="off" />)}
              {field('New mailbox password', 'mail-next', <PasswordInput id="mail-next" value={mail.next} onChange={v => setMail(m => ({ ...m, next: v }))} autoComplete="new-password" />, `At least ${MIN_PASSWORD} characters.`)}
              {field('New mailbox password again', 'mail-again', <PasswordInput id="mail-again" value={mail.again} onChange={v => setMail(m => ({ ...m, again: v }))} autoComplete="new-password" />)}
            </div>
            <Notice text={mailMsg.text} ok={mailMsg.ok} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)', alignItems: 'center' }}>
              <button type="submit" className="btn-primary" disabled={mailBusy || !supabase} style={{ fontSize: '0.8rem' }}>
                {mailBusy ? 'Changing…' : 'Change Mailbox Password'}
              </button>
              <a href={WEBMAIL_SETTINGS} target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-plum-soft)' }}>
                Or change it on the mail server’s own page →
              </a>
            </div>
          </form>
        </Section>
      </div>
    </AdminLayout>
  )
}
