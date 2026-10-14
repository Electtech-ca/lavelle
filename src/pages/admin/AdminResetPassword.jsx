import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { MIN_PASSWORD } from '../../lib/adminFunctions'

/* /admin/reset-password — where the "Forgot your password?" email link
   lands. The link signs the browser in for this one purpose; the new
   password is set here, then the admin portal opens. */
export default function AdminResetPassword() {
  const navigate = useNavigate()
  const [ready, setReady]   = useState(null)        // null while the link is read, then true / false
  const [next, setNext]     = useState('')
  const [again, setAgain]   = useState('')
  const [error, setError]   = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!supabase) { setReady(false); return }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) setReady(true)
    })
    // The link may already have been read before this page listened.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true)
      else setTimeout(() => setReady(r => r ?? false), 2500)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function save(e) {
    e.preventDefault()
    if (next.length < MIN_PASSWORD) { setError(`The new password needs at least ${MIN_PASSWORD} characters.`); return }
    if (next !== again) { setError('The two passwords are not the same.'); return }
    setSaving(true); setError('')
    const { error: err } = await supabase.auth.updateUser({ password: next })
    setSaving(false)
    if (err) setError(err.message)
    else navigate('/admin', { replace: true })
  }

  const input = { width: '100%', padding: '14px 18px', border: '1px solid var(--lavelle-cream)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', boxSizing: 'border-box' }
  const label = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 600, color: 'var(--lavelle-charcoal)', display: 'block', marginBottom: '6px' }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #2E3350 0%, #1a1f3a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-xl)' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2xl)', boxShadow: '0 40px 120px rgba(0,0,0,0.5)' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)', marginBottom: 'var(--space-lg)', textAlign: 'center' }}>Choose a new password</h1>
        {ready === null && <p style={{ fontFamily: 'var(--font-body)', textAlign: 'center', color: 'var(--lavelle-gray-mid)' }}>Checking your link…</p>}
        {ready === false && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', lineHeight: 1.7, textAlign: 'center' }}>
            This link has expired or was already used. <a href="/admin/login" style={{ color: 'var(--lavelle-plum-soft)' }}>Ask for a new one</a>, or ask another admin to set a new password on Admin Users.
          </p>
        )}
        {ready && (
          <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div>
              <label style={label} htmlFor="rp-next">New password</label>
              <input id="rp-next" type="password" autoComplete="new-password" value={next} onChange={e => setNext(e.target.value)} style={input} />
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--lavelle-gray-mid)', marginTop: '4px' }}>At least {MIN_PASSWORD} characters.</p>
            </div>
            <div>
              <label style={label} htmlFor="rp-again">New password again</label>
              <input id="rp-again" type="password" autoComplete="new-password" value={again} onChange={e => setAgain(e.target.value)} style={input} />
            </div>
            {error && <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: '#c0392b' }}>{error}</p>}
            <button type="submit" className="btn-primary" disabled={saving} style={{ width: '100%', padding: '14px' }}>{saving ? 'Saving…' : 'Save and Sign In'}</button>
          </form>
        )}
      </div>
    </div>
  )
}
