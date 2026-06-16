import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { supabase } from '../../lib/supabase'

const STATUS_COLORS = {
  succeeded: { bg: 'rgba(46,125,94,0.12)',  color: '#2E7D5E',  label: 'Succeeded' },
  pending:   { bg: 'rgba(228,62,45,0.15)', color: '#b83020',  label: 'Pending' },
  failed:    { bg: 'rgba(192,57,43,0.1)',    color: '#C0392B',  label: 'Failed' },
  refunded:  { bg: 'rgba(107,140,186,0.15)', color: '#4a6ea8',  label: 'Refunded' },
}

const METHOD_LABELS = {
  card:     '💳 Card (Stripe)',
  in_store: '🏪 In Store',
  invoice:  '📋 Invoice',
}

export default function AdminPayments() {
  const [payments, setPayments]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [filter, setFilter]       = useState('all')
  const [search, setSearch]       = useState('')
  const [selected, setSelected]   = useState(null)
  const [updating, setUpdating]   = useState(false)

  const load = () => {
    if (!supabase) { setLoading(false); return }
    supabase.from('payments').select('*').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('[AdminPayments]', error.message)
        setPayments(data || [])
        setLoading(false)
      })
      .catch(err => { console.error('[AdminPayments] fetch failed:', err); setLoading(false) })
  }

  useEffect(load, [])

  const updateStatus = async (id, newStatus) => {
    setUpdating(true)
    if (supabase) {
      await supabase.from('payments').update({ status: newStatus }).eq('id', id)
      setPayments(p => p.map(x => x.id === id ? { ...x, status: newStatus } : x))
      if (selected?.id === id) setSelected(s => ({ ...s, status: newStatus }))
    }
    setUpdating(false)
  }

  const filtered = payments.filter(p => {
    if (filter !== 'all' && p.status !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        (p.customer_email || '').toLowerCase().includes(q) ||
        (p.customer_name  || '').toLowerCase().includes(q) ||
        (p.reference      || '').toLowerCase().includes(q) ||
        (p.type           || '').toLowerCase().includes(q)
      )
    }
    return true
  })

  const total     = payments.filter(p => p.status === 'succeeded').reduce((s, p) => s + (p.amount || 0), 0)
  const pending$  = payments.filter(p => p.status === 'pending').reduce((s, p) => s + (p.amount || 0), 0)

  const thStyle = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--lavelle-gray-mid)', padding: '10px 16px', textAlign: 'left', borderBottom: '1px solid var(--lavelle-cream)', whiteSpace: 'nowrap' }
  const tdStyle = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', padding: '12px 16px', borderBottom: '1px solid var(--lavelle-cream)', verticalAlign: 'middle' }

  return (
    <AdminLayout title="Payments">

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
        {[
          { label: 'Revenue (Confirmed)',   value: `$${(total / 100).toFixed(2)}`,   color: '#2E7D5E' },
          { label: 'Pending Revenue',       value: `$${(pending$ / 100).toFixed(2)}`,color: '#b83020' },
          { label: 'Total Orders',          value: payments.length,                   color: 'var(--lavelle-plum-deep)' },
          { label: 'Succeeded',             value: payments.filter(p => p.status === 'succeeded').length, color: '#2E7D5E' },
          { label: 'Pending Review',        value: payments.filter(p => p.status === 'pending').length,   color: '#b83020' },
          { label: 'Failed / Refunded',     value: payments.filter(p => ['failed','refunded'].includes(p.status)).length, color: '#C0392B' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)', boxShadow: 'var(--shadow-card)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', fontWeight: 300, color: s.color, lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', color: 'var(--lavelle-gray-mid)', marginTop: '6px', letterSpacing: '0.06em' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters + search */}
      <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', marginBottom: 'var(--space-lg)', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
          {['all', 'pending', 'succeeded', 'failed', 'refunded'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'capitalize', padding: '7px 16px', borderRadius: 'var(--radius-full)', border: filter === f ? '1px solid var(--lavelle-plum-deep)' : '1px solid var(--lavelle-cream)', background: filter === f ? 'var(--lavelle-plum-deep)' : 'var(--lavelle-white)', color: filter === f ? 'var(--lavelle-white)' : 'var(--lavelle-gray-mid)', cursor: 'pointer', transition: 'all 0.2s' }}>
              {f === 'all' ? 'All Orders' : f}
            </button>
          ))}
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, or reference…"
          style={{ flex: '1 1 260px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', padding: '8px 14px', border: '1px solid var(--lavelle-cream)', borderRadius: 'var(--radius-full)', background: 'var(--lavelle-white)', outline: 'none', color: 'var(--lavelle-charcoal)' }} />
      </div>

      {/* Table */}
      <div style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
        <div style={{ padding: 'var(--space-lg) var(--space-xl)', borderBottom: '1px solid var(--lavelle-cream)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)' }}>
            Payment Orders {!loading && <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', color: 'var(--lavelle-gray-mid)', fontWeight: 400, marginLeft: '8px' }}>({filtered.length} shown)</span>}
          </h3>
          <a href="/checkout" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--lavelle-plum-soft)', textDecoration: 'none' }}>
            + New Order ↗
          </a>
        </div>

        {!supabase ? (
          <div style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--lavelle-plum-soft)' }}>Connect Supabase to view payment records.</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', marginTop: 'var(--space-md)' }}>Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env</p>
          </div>
        ) : loading ? (
          <div style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--lavelle-gray-mid)' }}>Loading…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--lavelle-plum-soft)' }}>No orders found.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['Reference', 'Customer', 'Type', 'Amount', 'Method', 'Status', 'Date', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const sc = STATUS_COLORS[p.status] || STATUS_COLORS.pending
                  return (
                    <tr key={p.id}
                      style={{ cursor: 'pointer', transition: 'background 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--lavelle-ivory)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = '' }}
                      onClick={() => setSelected(p)}>
                      <td style={tdStyle}><code style={{ fontSize: '0.72rem', color: 'var(--lavelle-gray-mid)', background: 'var(--lavelle-cream)', padding: '2px 6px', borderRadius: '4px' }}>{p.reference || '—'}</code></td>
                      <td style={tdStyle}>
                        <p style={{ fontWeight: 600, color: 'var(--lavelle-plum-deep)', marginBottom: '2px' }}>{p.customer_name || '—'}</p>
                        <p style={{ fontSize: '0.72rem', color: 'var(--lavelle-gray-mid)' }}>{p.customer_email || ''}</p>
                      </td>
                      <td style={tdStyle}>{p.type || '—'}</td>
                      <td style={{ ...tdStyle, fontWeight: 600, color: 'var(--lavelle-plum-deep)' }}>${((p.amount || 0) / 100).toFixed(2)}</td>
                      <td style={tdStyle}>{METHOD_LABELS[p.payment_method] || p.payment_method || '—'}</td>
                      <td style={tdStyle}>
                        <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-micro)', fontWeight: 600, textTransform: 'capitalize', background: sc.bg, color: sc.color }}>
                          {sc.label}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>{p.created_at ? new Date(p.created_at).toLocaleDateString('en-CA') : '—'}</td>
                      <td style={tdStyle} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {p.status === 'pending' && (
                            <button onClick={() => updateStatus(p.id, 'succeeded')} disabled={updating}
                              style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.06em', padding: '5px 10px', borderRadius: 'var(--radius-full)', border: 'none', background: 'rgba(46,125,94,0.12)', color: '#2E7D5E', cursor: 'pointer' }}>
                              ✓ Confirm
                            </button>
                          )}
                          {p.status === 'succeeded' && (
                            <button onClick={() => updateStatus(p.id, 'refunded')} disabled={updating}
                              style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.06em', padding: '5px 10px', borderRadius: 'var(--radius-full)', border: 'none', background: 'rgba(107,140,186,0.12)', color: '#4a6ea8', cursor: 'pointer' }}>
                              Refund
                            </button>
                          )}
                          {p.status === 'pending' && (
                            <button onClick={() => updateStatus(p.id, 'failed')} disabled={updating}
                              style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.06em', padding: '5px 10px', borderRadius: 'var(--radius-full)', border: 'none', background: 'rgba(192,57,43,0.08)', color: '#C0392B', cursor: 'pointer' }}>
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order detail slide-over */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,20,35,0.55)', zIndex: 999, display: 'flex', justifyContent: 'flex-end', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) setSelected(null) }}>
          <div style={{ width: '420px', maxWidth: '100vw', background: 'var(--lavelle-white)', height: '100%', overflowY: 'auto', boxShadow: '-20px 0 60px rgba(0,0,0,0.25)', padding: 'var(--space-2xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)' }}>Order Details</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'var(--lavelle-ivory)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '1rem', color: 'var(--lavelle-gray-mid)' }}>✕</button>
            </div>

            {/* Status badge */}
            {(() => { const sc = STATUS_COLORS[selected.status] || STATUS_COLORS.pending; return (
              <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 'var(--radius-full)', background: sc.bg, color: sc.color, fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 700, marginBottom: 'var(--space-xl)' }}>
                {sc.label}
              </div>
            )})()}

            {[
              ['Reference',    selected.reference || '—'],
              ['Customer',     selected.customer_name || '—'],
              ['Email',        selected.customer_email || '—'],
              ['Phone',        selected.phone || '—'],
              ['Order Type',   selected.type || '—'],
              ['Description',  selected.description || '—'],
              ['Amount',       `$${((selected.amount || 0) / 100).toFixed(2)} CAD`],
              ['Payment',      METHOD_LABELS[selected.payment_method] || selected.payment_method || '—'],
              ['Notes',        selected.notes || '—'],
              ['Date',         selected.created_at ? new Date(selected.created_at).toLocaleString('en-CA') : '—'],
            ].map(([k, v]) => (
              <div key={k} style={{ padding: '10px 0', borderBottom: '1px solid var(--lavelle-cream)' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--lavelle-gray-mid)', marginBottom: '3px' }}>{k}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', lineHeight: 1.5 }}>{v}</p>
              </div>
            ))}

            {/* Actions */}
            <div style={{ marginTop: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {selected.status === 'pending' && (
                <>
                  <button onClick={() => updateStatus(selected.id, 'succeeded')} disabled={updating} className="btn-primary" style={{ width: '100%' }}>
                    ✓ Mark as Succeeded
                  </button>
                  <button onClick={() => updateStatus(selected.id, 'failed')} disabled={updating}
                    style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', padding: '12px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(192,57,43,0.3)', background: 'rgba(192,57,43,0.06)', color: '#C0392B', cursor: 'pointer', width: '100%' }}>
                    Cancel Order
                  </button>
                </>
              )}
              {selected.status === 'succeeded' && (
                <button onClick={() => updateStatus(selected.id, 'refunded')} disabled={updating}
                  style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', padding: '12px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(107,140,186,0.3)', background: 'rgba(107,140,186,0.08)', color: '#4a6ea8', cursor: 'pointer', width: '100%' }}>
                  Issue Refund
                </button>
              )}
              {selected.customer_email && (
                <a href={`mailto:${selected.customer_email}?subject=Your Sparivier Order ${selected.reference}`}
                  style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', padding: '12px', borderRadius: 'var(--radius-full)', border: '1px solid var(--lavelle-cream)', background: 'var(--lavelle-ivory)', color: 'var(--lavelle-charcoal)', cursor: 'pointer', textAlign: 'center', display: 'block', textDecoration: 'none' }}>
                  ✉ Email Customer
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
