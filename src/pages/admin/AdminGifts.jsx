import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { supabase } from '../../lib/supabase'

/* ──────────────────────────────────────────────────────────────
   Admin ▸ Gift Certificates — every certificate ordered on the site
   (public.gift_orders). An order is "pending" until Stripe confirms
   payment and the webhook marks it "active"; staff mark it "redeemed"
   when it is used, which the certificate's own page then shows.
   ────────────────────────────────────────────────────────────── */

const STATUS = {
  active:   { label: 'Active',           bg: 'rgba(46,125,94,0.12)',   color: '#2E7D5E' },
  redeemed: { label: 'Redeemed',         bg: 'rgba(107,140,186,0.15)', color: '#4a6ea8' },
  pending:  { label: 'Awaiting payment', bg: 'rgba(228,62,45,0.12)',   color: '#b83020' },
  expired:  { label: 'Expired',          bg: 'var(--lavelle-cream)',    color: 'var(--lavelle-gray-mid)' },
}
const FILTERS = [
  { id: 'all',      label: 'All' },
  { id: 'active',   label: 'Active' },
  { id: 'redeemed', label: 'Redeemed' },
  { id: 'pending',  label: 'Awaiting payment' },
]

const money = cents => `$${((cents || 0) / 100).toFixed(2)}`
const valueOf = o => o.cert_amount ?? o.amount

export default function AdminGifts() {
  const [orders,   setOrders]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [notice,   setNotice]   = useState('')
  const [filter,   setFilter]   = useState('all')
  const [search,   setSearch]   = useState('')
  const [updating, setUpdating] = useState(null)   // id of the order being changed

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase.from('gift_orders').select('*').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) { console.error('[AdminGifts]', error.message); setNotice('Certificates could not be loaded: ' + error.message) }
        setOrders(data || [])
        setLoading(false)
      })
      .catch(err => { console.error('[AdminGifts] fetch failed:', err); setNotice('Certificates could not be loaded.'); setLoading(false) })
  }, [])

  async function setStatus(order, status) {
    if (status === 'redeemed' &&
        !window.confirm(`Mark ${order.cert_code || 'this certificate'} (${money(valueOf(order))}) as redeemed?`)) return
    setUpdating(order.id)
    setNotice('')
    const { data, error } = await supabase.from('gift_orders').update({ status }).eq('id', order.id).select().single()
    setUpdating(null)
    if (error) { setNotice('Could not update the certificate: ' + error.message); return }
    setOrders(prev => prev.map(o => o.id === data.id ? data : o))
  }

  const q = search.trim().toLowerCase()
  const filtered = orders.filter(o =>
    (filter === 'all' || o.status === filter) &&
    (!q || [o.cert_code, o.item_name, o.sender_name, o.sender_email, o.recipient_name, o.recipient_email]
      .some(v => (v || '').toLowerCase().includes(q))))

  const count = status => orders.filter(o => o.status === status).length
  const stats = [
    { label: 'Active certificates',  value: count('active'),   sub: `${money(orders.filter(o => o.status === 'active').reduce((s, o) => s + (valueOf(o) || 0), 0))} still to spend` },
    { label: 'Redeemed',             value: count('redeemed') },
    { label: 'Awaiting payment',     value: count('pending'),  sub: 'Started, not paid' },
  ]

  const thStyle = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--lavelle-gray-mid)', padding: '10px 16px', textAlign: 'left', borderBottom: '1px solid var(--lavelle-cream)', whiteSpace: 'nowrap' }
  const tdStyle = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', padding: '12px 16px', borderBottom: '1px solid var(--lavelle-cream)', verticalAlign: 'top' }
  const subText = { display: 'block', fontSize: '0.72rem', color: 'var(--lavelle-gray-mid)', marginTop: '2px' }
  const actionBtn = (color, border) => ({ fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 600, padding: '5px 12px', borderRadius: 'var(--radius-full)', border: `1px solid ${border}`, background: 'none', color, cursor: 'pointer', whiteSpace: 'nowrap' })

  return (
    <AdminLayout title="Gift Certificates">

      {notice && (
        <div role="alert" style={{ background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.25)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-md) var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: '#C0392B' }}>{notice}</p>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)', boxShadow: 'var(--shadow-card)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 300, color: 'var(--lavelle-plum-deep)', lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', marginTop: '6px' }}>{s.label}</p>
            {s.sub && <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--lavelle-gray-mid)', marginTop: '2px' }}>{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* Filters + search */}
      <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', marginBottom: 'var(--space-lg)', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 500, padding: '8px 18px', borderRadius: 'var(--radius-full)', border: '1px solid', borderColor: filter === f.id ? 'var(--lavelle-plum-deep)' : 'var(--lavelle-cream)', background: filter === f.id ? 'var(--lavelle-plum-deep)' : 'var(--lavelle-white)', color: filter === f.id ? 'var(--lavelle-white)' : 'var(--lavelle-gray-mid)', cursor: 'pointer' }}>
              {f.label}
            </button>
          ))}
        </div>
        <input type="search" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by code, name or email…"
          style={{ flex: '1 1 260px', maxWidth: '360px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', padding: '10px 16px', border: '1px solid var(--lavelle-cream)', borderRadius: 'var(--radius-full)', background: 'var(--lavelle-white)', outline: 'none', color: 'var(--lavelle-charcoal)' }} />
      </div>

      {/* Certificates table */}
      <div style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
        {!supabase ? (
          <div style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--lavelle-plum-soft)' }}>Connect Supabase to view gift certificates.</p>
          </div>
        ) : loading ? (
          <div style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--lavelle-gray-mid)' }}>Loading…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--lavelle-plum-soft)' }}>
              {orders.length ? 'No certificates match.' : 'No gift certificates yet.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>{['Code', 'Value', 'From', 'To', 'Status', 'Ordered', ''].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {filtered.map(o => {
                  const st = STATUS[o.status] || STATUS.pending
                  return (
                    <tr key={o.id}>
                      <td style={tdStyle}>
                        <code style={{ fontSize: '0.78rem', color: 'var(--lavelle-plum-deep)', background: 'var(--lavelle-cream)', padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap' }}>{o.cert_code || '—'}</code>
                        {o.item_name && <span style={subText}>{o.item_name}</span>}
                      </td>
                      <td style={{ ...tdStyle, fontWeight: 600, color: 'var(--lavelle-plum-deep)', whiteSpace: 'nowrap' }}>
                        {money(valueOf(o))}
                        {o.cert_amount != null && o.amount !== o.cert_amount && <span style={{ ...subText, fontWeight: 400 }}>paid {money(o.amount)}</span>}
                      </td>
                      <td style={tdStyle}>{o.sender_name || '—'}<span style={subText}>{o.sender_email}</span></td>
                      <td style={tdStyle}>{o.recipient_name || '—'}<span style={subText}>{o.recipient_email}</span></td>
                      <td style={tdStyle}>
                        <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-micro)', fontWeight: 600, whiteSpace: 'nowrap', background: st.bg, color: st.color }}>{st.label}</span>
                      </td>
                      <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>{o.created_at ? new Date(o.created_at).toLocaleDateString('en-CA') : '—'}</td>
                      <td style={tdStyle}>
                        {o.status === 'active' && (
                          <button onClick={() => setStatus(o, 'redeemed')} disabled={updating === o.id} style={actionBtn('#4a6ea8', 'rgba(107,140,186,0.5)')}>
                            {updating === o.id ? 'Saving…' : 'Mark redeemed'}
                          </button>
                        )}
                        {o.status === 'redeemed' && (
                          <button onClick={() => setStatus(o, 'active')} disabled={updating === o.id} title="Make the certificate active again" style={actionBtn('var(--lavelle-gray-mid)', 'var(--lavelle-cream)')}>
                            {updating === o.id ? 'Saving…' : 'Undo'}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', color: 'var(--lavelle-gray-mid)', marginTop: 'var(--space-md)', lineHeight: 1.6 }}>
        "Awaiting payment" orders were started on the site but Stripe has not confirmed a payment for them.
        Payments themselves are in the Stripe dashboard.
      </p>
    </AdminLayout>
  )
}
