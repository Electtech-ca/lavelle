import { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import { supabase } from '../../lib/supabase'
import { callAdminFunction, MIN_PASSWORD } from '../../lib/adminFunctions'
import { Plus, KeyRound, Trash2, Database } from 'lucide-react'
import {
  Notice, DevModeNotice, Modal, ConfirmDelete, intro, card, inputStyle, labelStyle, hintStyle, pillButton,
} from './adminUi'

/* ──────────────────────────────────────────────────────────────
   Admin ▸ Admin Users — who can sign in to the admin portal: add an
   admin, set a new password for one, give or take Supabase Studio
   access, remove one. Done by the admin-users function on the server.
   ────────────────────────────────────────────────────────────── */

const when = iso => (iso ? new Date(iso).toLocaleDateString('en-CA', { dateStyle: 'medium' }) : 'Never')

/* A random password to hand over, for "Suggest one". */
function suggestPassword() {
  const words = ['river', 'cedar', 'maple', 'velvet', 'harbour', 'meadow', 'amber', 'willow', 'silver', 'quartz', 'fern', 'lilac']
  const pick = () => words[crypto.getRandomValues(new Uint32Array(1))[0] % words.length]
  const n = 10 + (crypto.getRandomValues(new Uint32Array(1))[0] % 90)
  return `${pick()}-${pick()}-${pick()}-${n}`
}

export default function AdminUsers() {
  const [users, setUsers]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [notice, setNotice]     = useState({ text: '', ok: false })
  const [adding, setAdding]     = useState(false)
  const [form, setForm]         = useState({ email: '', full_name: '', password: '', studio_access: false })
  const [pwFor, setPwFor]       = useState(null)
  const [newPw, setNewPw]       = useState('')
  const [removing, setRemoving] = useState(null)
  const [busy, setBusy]         = useState(false)
  const [formError, setFormError] = useState('')

  const me = users.find(u => u.you)

  async function run(body, done) {
    setBusy(true); setFormError('')
    try {
      const reply = await callAdminFunction('admin-users', body)
      if (reply?.users) setUsers(reply.users)
      done?.()
      return true
    } catch (err) {
      setFormError(err.message)
      return false
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    callAdminFunction('admin-users', { action: 'list' })
      .then(reply => setUsers(reply.users || []))
      .catch(err => setNotice({ text: 'Admin users could not be loaded: ' + err.message, ok: false }))
      .finally(() => setLoading(false))
  }, [])

  async function add(e) {
    e.preventDefault()
    if (form.password.length < MIN_PASSWORD) { setFormError(`The password needs at least ${MIN_PASSWORD} characters.`); return }
    await run({ action: 'add', ...form }, () => {
      setNotice({ text: `${form.email} can now sign in to the admin portal with the password you chose. Give it to them in person or by phone, not by email, and ask them to change it on My Account.`, ok: true })
      setAdding(false)
      setForm({ email: '', full_name: '', password: '', studio_access: false })
    })
  }

  async function setPassword(e) {
    e.preventDefault()
    if (newPw.length < MIN_PASSWORD) { setFormError(`The password needs at least ${MIN_PASSWORD} characters.`); return }
    await run({ action: 'password', user_id: pwFor.id, password: newPw }, () => {
      setNotice({ text: `${pwFor.email} has a new password. Tell them in person or by phone, and ask them to change it on My Account.`, ok: true })
      setPwFor(null); setNewPw('')
    })
  }

  const toggleStudio = u => run({ action: 'studio', user_id: u.id, studio_access: !u.studio_access })
    .then(ok => { if (!ok) setNotice({ text: 'Studio access not changed.', ok: false }) })

  async function remove() {
    const ok = await run({ action: 'remove', user_id: removing.id })
    if (ok) setNotice({ text: `${removing.email} can no longer sign in.`, ok: true })
    else setNotice({ text: 'Not removed.', ok: false })
    setRemoving(null)
  }

  return (
    <AdminLayout title="Admin Users">
      {!supabase && <DevModeNotice />}
      <p style={intro}>
        The people who can sign in to this admin portal. Each has their own email and password, and changes their
        password on My Account. Supabase Studio, the database's control panel, opens only for admins with Studio
        access; only someone who has it can give it.
      </p>
      <Notice text={notice.text} ok={notice.ok} onClose={() => setNotice({ text: '', ok: false })} />
      {formError && !adding && !pwFor && <Notice text={formError} onClose={() => setFormError('')} />}

      <div style={{ display: 'flex', marginBottom: 'var(--space-xl)' }}>
        <button onClick={() => { setAdding(true); setFormError('') }} className="btn-primary" disabled={!supabase}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', marginLeft: 'auto' }}>
          <Plus size={15} /> Add Admin
        </button>
      </div>

      {loading ? (
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--lavelle-gray-mid)', textAlign: 'center', padding: 'var(--space-3xl)' }}>Loading admin users…</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {users.map(u => (
            <div key={u.id} style={{ ...card, display: 'flex', flexWrap: 'wrap', gap: 'var(--space-lg)', alignItems: 'center' }}>
              <div style={{ flex: '1 1 260px', minWidth: 0 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 'var(--space-sm)' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)' }}>{u.full_name || u.email}</h3>
                  {u.you && <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'rgba(233,176,185,0.25)', color: 'var(--lavelle-plum-deep)' }}>You</span>}
                  {u.studio_access && <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'rgba(46,125,94,0.1)', color: '#2E7D5E' }}>Studio access</span>}
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)' }}>
                  {u.full_name ? `${u.email} · ` : ''}Last signed in: {when(u.last_sign_in_at)}
                </p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {me?.studio_access && !u.you && (
                  <button onClick={() => toggleStudio(u)} disabled={busy} style={pillButton()}>
                    <Database size={12} /> {u.studio_access ? 'Take Studio access' : 'Give Studio access'}
                  </button>
                )}
                {!u.you && (
                  <button onClick={() => { setPwFor(u); setNewPw(''); setFormError('') }} style={pillButton()}>
                    <KeyRound size={12} /> New password
                  </button>
                )}
                {!u.you && (
                  <button onClick={() => setRemoving(u)} style={pillButton('var(--lavelle-alert)')}>
                    <Trash2 size={12} /> Remove
                  </button>
                )}
                {u.you && <a href="/admin/account" style={{ ...pillButton(), textDecoration: 'none' }}><KeyRound size={12} /> Change my password</a>}
              </div>
            </div>
          ))}
        </div>
      )}

      {adding && (
        <Modal title="Add an admin" onClose={() => setAdding(false)} width="560px">
          <form onSubmit={add} style={{ padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <div>
              <label style={labelStyle} htmlFor="new-email">Email address *</label>
              <input id="new-email" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} autoComplete="off" style={inputStyle(false)} />
              <p style={hintStyle}>What they sign in with. Any email address works.</p>
            </div>
            <div>
              <label style={labelStyle} htmlFor="new-name">Name</label>
              <input id="new-name" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} style={inputStyle(false)} />
            </div>
            <div>
              <label style={labelStyle} htmlFor="new-password">First password *</label>
              <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                <input id="new-password" type="text" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} autoComplete="off" style={inputStyle(false)} />
                <button type="button" onClick={() => setForm(f => ({ ...f, password: suggestPassword() }))} style={pillButton()}>Suggest one</button>
              </div>
              <p style={hintStyle}>At least {MIN_PASSWORD} characters. They change it on My Account after signing in.</p>
            </div>
            {me?.studio_access && (
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.studio_access} onChange={e => setForm(f => ({ ...f, studio_access: e.target.checked }))} style={{ width: '18px', height: '18px', accentColor: 'var(--lavelle-plum-deep)' }} />
                Can open Supabase Studio
              </label>
            )}
            {formError && <Notice text={formError} />}
            <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setAdding(false)} className="btn-secondary" style={{ fontSize: '0.8rem' }}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={busy} style={{ fontSize: '0.8rem' }}>{busy ? 'Adding…' : 'Add Admin'}</button>
            </div>
          </form>
        </Modal>
      )}

      {pwFor && (
        <Modal title={`New password for ${pwFor.full_name || pwFor.email}`} onClose={() => setPwFor(null)} width="520px">
          <form onSubmit={setPassword} style={{ padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <div>
              <label style={labelStyle} htmlFor="reset-password">New password</label>
              <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                <input id="reset-password" type="text" value={newPw} onChange={e => setNewPw(e.target.value)} autoComplete="off" style={inputStyle(false)} />
                <button type="button" onClick={() => setNewPw(suggestPassword())} style={pillButton()}>Suggest one</button>
              </div>
              <p style={hintStyle}>For someone who forgot theirs. At least {MIN_PASSWORD} characters; they change it on My Account afterwards.</p>
            </div>
            {formError && <Notice text={formError} />}
            <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setPwFor(null)} className="btn-secondary" style={{ fontSize: '0.8rem' }}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={busy} style={{ fontSize: '0.8rem' }}>{busy ? 'Saving…' : 'Set Password'}</button>
            </div>
          </form>
        </Modal>
      )}

      {removing && (
        <ConfirmDelete
          title={`Remove ${removing.full_name || removing.email}?`}
          text="They will no longer be able to sign in to the admin portal or Supabase Studio. Their account is deleted."
          confirmLabel="Yes, Remove" busy={busy} onCancel={() => setRemoving(null)} onConfirm={remove} />
      )}
    </AdminLayout>
  )
}
