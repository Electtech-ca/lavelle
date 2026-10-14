import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'

/* The admin portal's sign-in, with "Forgot your password?" (an email link
   to /admin/reset-password). `next` is the admin page to open afterwards,
   e.g. /admin/studio when Supabase Studio sent the browser here. */
export default function AdminLogin() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { signIn } = useAuth()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [forgot,   setForgot]   = useState(false)
  const [sent,     setSent]     = useState(false)

  const next = params.get('next')
  const target = next && next.startsWith('/admin') && !next.startsWith('//') ? next : '/admin'

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await signIn(email, password)
    if (err) {
      setError(err.message === 'Invalid login credentials' ? 'That email and password do not match an account.' : err.message)
      setLoading(false)
    } else {
      navigate(target)
    }
  }

  async function handleForgot(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/admin/reset-password` })
    setLoading(false)
    if (err) setError(err.message)
    else setSent(true)
  }

  const inputStyle = {
    width: '100%', padding: '14px 18px', border: '1px solid var(--lavelle-cream)',
    borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)',
    color: 'var(--lavelle-charcoal)', background: 'var(--lavelle-white)', outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.2s ease',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #2E3350 0%, #1a1f3a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-xl)' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <img
            src="/logo.png"
            alt="Spa Rivier"
            style={{ height: '100px', width: 'auto', display: 'block', margin: '0 auto var(--space-md)' }}
          />
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#E9B0B9' }}>
            Admin Portal
          </p>
        </div>

        <div style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2xl)', boxShadow: '0 40px 120px rgba(0,0,0,0.5)' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)', marginBottom: 'var(--space-sm)', textAlign: 'center' }}>
            {forgot ? 'Forgot your password?' : 'Welcome Back'}
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
            {forgot ? 'We will email you a link to choose a new one.' : 'Sign in to your Spa Rivier admin account'}
          </p>

          {error && (
            <div style={{ background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.25)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: '#c0392b' }}>{error}</p>
            </div>
          )}

          {forgot && sent ? (
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', lineHeight: 1.7, textAlign: 'center' }}>
              <p style={{ marginBottom: 'var(--space-md)' }}>If {email} has an admin account, a link to choose a new password is on its way. It works once, for a short time.</p>
              <p style={{ marginBottom: 'var(--space-lg)', color: 'var(--lavelle-gray-mid)' }}>Nothing after a few minutes? Check the spam folder, or ask another admin to set a new password for you on Admin Users.</p>
              <button type="button" className="btn-secondary" onClick={() => { setForgot(false); setSent(false) }}>Back to Sign In</button>
            </div>
          ) : (
          <form onSubmit={forgot ? handleForgot : handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--lavelle-charcoal)', display: 'block', marginBottom: '6px' }}>
                Email Address
              </label>
              <input
                type="email" required autoComplete="username"
                value={email} onChange={e => setEmail(e.target.value)}
                style={inputStyle} placeholder="admin@sparivier.ca"
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--lavelle-plum-soft)' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--lavelle-cream)' }}
              />
            </div>
            {!forgot && <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--lavelle-charcoal)', display: 'block', marginBottom: '6px' }}>
                Password
              </label>
              <input
                type="password" required autoComplete="current-password"
                value={password} onChange={e => setPassword(e.target.value)}
                style={inputStyle} placeholder="••••••••"
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--lavelle-plum-soft)' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--lavelle-cream)' }}
              />
            </div>}
            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', marginTop: 'var(--space-sm)', padding: '14px' }}
              disabled={loading}>
              {forgot ? (loading ? 'Sending…' : 'Email Me a Link') : (loading ? 'Signing in…' : 'Sign In to Admin')}
            </button>
            <button type="button" onClick={() => { setForgot(f => !f); setError('') }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-plum-soft)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
              {forgot ? 'Back to Sign In' : 'Forgot your password?'}
            </button>
          </form>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>
          <a href="/" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>
            ← Back to Spa Rivier
          </a>
        </p>
      </div>
    </div>
  )
}
