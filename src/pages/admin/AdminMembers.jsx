import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { supabase } from '../../lib/supabase'

export default function AdminMembers() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase.from('profiles').select('*').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('[AdminMembers]', error.message)
        setMembers(data || [])
        setLoading(false)
      })
      .catch(err => { console.error('[AdminMembers] fetch failed:', err); setLoading(false) })
  }, [])

  const filtered = members.filter(m =>
    !search || m.email?.toLowerCase().includes(search.toLowerCase()) || m.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  const thStyle = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--lavelle-gray-mid)', padding: '10px 16px', textAlign: 'left', borderBottom: '1px solid var(--lavelle-cream)' }
  const tdStyle = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', padding: '12px 16px', borderBottom: '1px solid var(--lavelle-cream)' }

  return (
    <AdminLayout title="Members">
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <input
          type="search" placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ padding: '12px 18px', border: '1px solid var(--lavelle-cream)', borderRadius: 'var(--radius-full)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', color: 'var(--lavelle-charcoal)', background: 'var(--lavelle-white)', outline: 'none', width: '100%', maxWidth: '400px' }}
        />
      </div>

      <div style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
        {!supabase ? (
          <div style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--lavelle-plum-soft)' }}>Connect Supabase to manage members.</p>
          </div>
        ) : loading ? (
          <div style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--lavelle-gray-mid)' }}>Loading members…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--lavelle-plum-soft)' }}>{search ? 'No members match your search.' : 'No members yet.'}</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['Name', 'Email', 'Tier', 'Points', 'Joined'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {filtered.map(m => (
                  <tr key={m.id}>
                    <td style={tdStyle}>{m.full_name || '—'}</td>
                    <td style={tdStyle}>{m.email || '—'}</td>
                    <td style={tdStyle}>{m.loyalty_tier || 'Champagne'}</td>
                    <td style={tdStyle}>{m.loyalty_points || 0}</td>
                    <td style={tdStyle}>{m.created_at ? new Date(m.created_at).toLocaleDateString('en-CA') : '—'}</td>
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
