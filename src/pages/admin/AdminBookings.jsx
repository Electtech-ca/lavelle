import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { supabase } from '../../lib/supabase'

const STATUS_COLORS = {
  pending:   { bg: 'rgba(228,62,45,0.12)', color: '#b83020' },
  confirmed: { bg: 'rgba(46,125,94,0.12)',   color: '#2E7D5E' },
  cancelled: { bg: 'rgba(192,57,43,0.1)',    color: '#C0392B' },
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase.from('bookings').select('*').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('[AdminBookings]', error.message)
        setBookings(data || [])
        setLoading(false)
      })
      .catch(err => { console.error('[AdminBookings] fetch failed:', err); setLoading(false) })
  }, [])

  async function updateStatus(id, status) {
    if (!supabase) return
    await supabase.from('bookings').update({ status }).eq('id', id)
    setBookings(b => b.map(bk => bk.id === id ? { ...bk, status } : bk))
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  const thStyle = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--lavelle-gray-mid)', padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid var(--lavelle-cream)' }
  const tdStyle = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', padding: '14px 16px', borderBottom: '1px solid var(--lavelle-cream)' }

  return (
    <AdminLayout title="Bookings">
      <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
        {['all', 'pending', 'confirmed', 'cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 500, padding: '8px 18px', borderRadius: 'var(--radius-full)', border: '1px solid', borderColor: filter === f ? 'var(--lavelle-plum-deep)' : 'var(--lavelle-cream)', background: filter === f ? 'var(--lavelle-plum-deep)' : 'var(--lavelle-white)', color: filter === f ? 'var(--lavelle-white)' : 'var(--lavelle-gray-mid)', cursor: 'pointer', textTransform: 'capitalize' }}>
            {f}
          </button>
        ))}
      </div>

      <div style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
        {!supabase ? (
          <div style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--lavelle-plum-soft)' }}>Supabase not configured — bookings will appear here once connected.</p>
          </div>
        ) : loading ? (
          <div style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--lavelle-gray-mid)' }}>Loading bookings…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--lavelle-plum-soft)' }}>No bookings found.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Name', 'Service', 'Date & Time', 'Phone', 'Status', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b.id}>
                    <td style={tdStyle}>{b.name}</td>
                    <td style={tdStyle}>{b.service}</td>
                    <td style={tdStyle}>{b.booking_date} {b.booking_time && `at ${b.booking_time}`}</td>
                    <td style={tdStyle}>{b.phone || '—'}</td>
                    <td style={tdStyle}>
                      <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-micro)', fontWeight: 600, textTransform: 'capitalize', ...(STATUS_COLORS[b.status] || STATUS_COLORS.pending) }}>
                        {b.status || 'pending'}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                        <button onClick={() => updateStatus(b.id, 'confirmed')} style={{ fontSize: '0.7rem', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid var(--lavelle-success)', background: 'none', color: 'var(--lavelle-success)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Confirm</button>
                        <button onClick={() => updateStatus(b.id, 'cancelled')} style={{ fontSize: '0.7rem', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid var(--lavelle-alert)', background: 'none', color: 'var(--lavelle-alert)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Cancel</button>
                      </div>
                    </td>
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
