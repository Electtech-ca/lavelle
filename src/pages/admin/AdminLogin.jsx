import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await signIn(email, password)
    if (err) {
      setError(err.message)
      setLoading(false)
    } else {
      navigate('/admin')
    }
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
            alt="Sparivier"
            style={{ height: '100px', width: 'auto', display: 'block', margin: '0 auto var(--space-md)' }}
          />
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#E9B0B9' }}>
            Admin Portal
          </p>
        </div>

        <div style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2xl)', boxShadow: '0 40px 120px rgba(0,0,0,0.5)' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)', marginBottom: 'var(--space-sm)', textAlign: 'center' }}>
            Welcome Back
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
            Sign in to your Sparivier admin account
          </p>

          {/* Dev mode notice */}
          {!supabase && (
            <div style={{ background: 'rgba(228,62,45,0.1)', border: '1px solid rgba(228,62,45,0.3)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', color: '#b83020', lineHeight: 1.6 }}>
                <strong>Development Mode</strong> — Supabase not yet connected. Use the dev admin credentials below.
              </p>
            </div>
          )}

          {error && (
            <div style={{ background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.25)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: '#c0392b' }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
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
            <div>
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
            </div>
            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', marginTop: 'var(--space-sm)', padding: '14px' }}
              disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In to Admin'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>
          <a href="/" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>
            ← Back to Sparivier
          </a>
        </p>
      </div>
    </div>
  )
}
