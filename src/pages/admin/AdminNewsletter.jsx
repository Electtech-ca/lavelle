import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { supabase } from '../../lib/supabase'

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('[AdminNewsletter]', error.message)
        setSubscribers(data || [])
        setLoading(false)
      })
      .catch(err => { console.error('[AdminNewsletter] fetch failed:', err); setLoading(false) })
  }, [])

  function copyEmails() {
    const list = subscribers.map(s => s.email).join(', ')
    navigator.clipboard.writeText(list).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  const thStyle = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--lavelle-gray-mid)', padding: '10px 16px', textAlign: 'left', borderBottom: '1px solid var(--lavelle-cream)' }
  const tdStyle = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', padding: '12px 16px', borderBottom: '1px solid var(--lavelle-cream)' }

  return (
    <AdminLayout title="Newsletter Subscribers">
      <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
        <div style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-lg) var(--space-xl)', boxShadow: 'var(--shadow-card)', display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, color: 'var(--lavelle-plum-deep)', lineHeight: 1 }}>{subscribers.length}</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)' }}>Subscribers</p>
        </div>
        {subscribers.length > 0 && (
          <button onClick={copyEmails} className="btn-secondary" style={{ fontSize: '0.78rem' }}>
            {copied ? '✓ Copied!' : 'Copy All Emails'}
          </button>
        )}
      </div>

      <div style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
        {!supabase ? (
          <div style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--lavelle-plum-soft)' }}>Connect Supabase to view newsletter subscribers.</p>
          </div>
        ) : loading ? (
          <div style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--lavelle-gray-mid)' }}>Loading…</p>
          </div>
        ) : subscribers.length === 0 ? (
          <div style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--lavelle-plum-soft)' }}>No subscribers yet.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['Email', 'Language', 'Subscribed On'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {subscribers.map(s => (
                  <tr key={s.id}>
                    <td style={tdStyle}>{s.email}</td>
                    <td style={tdStyle}>{(s.language || 'en').toUpperCase()}</td>
                    <td style={tdStyle}>{s.created_at ? new Date(s.created_at).toLocaleDateString('en-CA') : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
