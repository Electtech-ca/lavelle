import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { supabase } from '../../lib/supabase'
import { giftItems, giftCertificates } from '../../data/giftsData'

export default function AdminGifts() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase.from('gift_orders').select('*').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('[AdminGifts]', error.message)
        setOrders(data || [])
        setLoading(false)
      })
      .catch(err => { console.error('[AdminGifts] fetch failed:', err); setLoading(false) })
  }, [])

  const thStyle = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--lavelle-gray-mid)', padding: '10px 16px', textAlign: 'left', borderBottom: '1px solid var(--lavelle-cream)' }
  const tdStyle = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', padding: '12px 16px', borderBottom: '1px solid var(--lavelle-cream)' }

  return (
    <AdminLayout title="Gifts & Certificates">
      {/* Static catalogue */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-lg)', marginBottom: 'var(--space-2xl)' }}>
        <div style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)', boxShadow: 'var(--shadow-card)', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 300, color: 'var(--lavelle-plum-deep)', lineHeight: 1 }}>{giftItems.length}</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', marginTop: '6px' }}>Gift Items</p>
        </div>
        <div style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)', boxShadow: 'var(--shadow-card)', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 300, color: 'var(--lavelle-plum-deep)', lineHeight: 1 }}>{giftCertificates.length}</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', marginTop: '6px' }}>Certificate Denominations</p>
        </div>
        <div style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)', boxShadow: 'var(--shadow-card)', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 300, color: 'var(--lavelle-plum-deep)', lineHeight: 1 }}>{orders.length}</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', marginTop: '6px' }}>Gift Orders</p>
        </div>
      </div>

      {/* Orders table */}
      <div style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
        <div style={{ padding: 'var(--space-lg) var(--space-xl)', borderBottom: '1px solid var(--lavelle-cream)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)' }}>Gift Orders</h3>
        </div>
        {!supabase ? (
          <div style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--lavelle-plum-soft)' }}>Connect Supabase to view gift orders.</p>
          </div>
        ) : loading ? (
          <div style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--lavelle-gray-mid)' }}>Loading…</p>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--lavelle-plum-soft)' }}>No gift orders yet.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>{['Order ID', 'Item', 'Amount', 'Recipient', 'Date'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td style={tdStyle}>{o.id.slice(0, 8)}…</td>
                  <td style={tdStyle}>{o.item_name || '—'}</td>
                  <td style={tdStyle}>{o.amount ? `$${o.amount}` : '—'}</td>
                  <td style={tdStyle}>{o.recipient_email || '—'}</td>
                  <td style={tdStyle}>{o.created_at ? new Date(o.created_at).toLocaleDateString('en-CA') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  )
}
