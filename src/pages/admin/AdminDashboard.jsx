import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import { supabase } from '../../lib/supabase'
import { CalendarDays, Users, Gift, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ bookings: 0, members: 0, subscribers: 0, gifts: 0 })

  useEffect(() => {
    if (!supabase) return
    async function load() {
      try {
        const [b, m, n, g] = await Promise.all([
          supabase.from('bookings').select('id', { count: 'exact', head: true }),
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('newsletter_subscribers').select('id', { count: 'exact', head: true }),
          supabase.from('gift_orders').select('id', { count: 'exact', head: true }),
        ])
        setStats({ bookings: b.count || 0, members: m.count || 0, subscribers: n.count || 0, gifts: g.count || 0 })
      } catch (err) {
        console.error('[AdminDashboard] stats load failed:', err)
      }
    }
    load()
  }, [])

  const cards = [
    { label: 'Total Bookings', value: stats.bookings, Icon: CalendarDays, color: 'var(--lavelle-plum-mid)' },
    { label: 'Members', value: stats.members, Icon: Users, color: 'var(--lavelle-gold-deep)' },
    { label: 'Newsletter Subscribers', value: stats.subscribers, Icon: TrendingUp, color: 'var(--lavelle-success)' },
    { label: 'Gift Orders', value: stats.gifts, Icon: Gift, color: '#6b8cba' },
  ]

  return (
    <AdminLayout title="Dashboard">
      {!supabase && (
        <div style={{ background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.25)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-alert)' }}>
            <strong>Supabase not configured.</strong> Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to the .env file to enable live data. The admin interface will display live statistics and full data management once connected.
          </p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-xl)', marginBottom: 'var(--space-2xl)' }}>
        {cards.map(({ label, value, Icon, color }) => (
          <div key={label} style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)', boxShadow: 'var(--shadow-card)', display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={22} color="white" />
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, color: 'var(--lavelle-charcoal)', lineHeight: 1 }}>{value}</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', color: 'var(--lavelle-gray-mid)', marginTop: '4px' }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-xl)' }}>
        <div style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)', boxShadow: 'var(--shadow-card)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)', marginBottom: 'var(--space-lg)' }}>Quick Links</h2>
          {[
            { href: '/admin/bookings', label: 'Manage Bookings' },
            { href: '/admin/products', label: 'Manage Products' },
            { href: '/admin/services', label: 'Edit Services & Pricing' },
            { href: '/admin/members', label: 'View Members' },
            { href: '/admin/newsletter', label: 'Newsletter Subscribers' },
            { href: '/admin/payments', label: 'Payment Records' },
          ].map(link => (
            <a key={link.href} href={link.href} style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-plum-soft)', textDecoration: 'none', padding: '8px 0', borderBottom: '1px solid var(--lavelle-cream)' }}>
              → {link.label}
            </a>
          ))}
        </div>

        <div style={{ background: 'linear-gradient(135deg, var(--lavelle-plum-deep) 0%, var(--lavelle-plum-mid) 100%)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)', boxShadow: 'var(--shadow-card)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, color: 'var(--lavelle-gold-champagne)', marginBottom: 'var(--space-md)' }}>System Status</h2>
          {[
            { label: 'Supabase', ok: !!supabase },
            { label: 'Stripe', ok: !!import.meta.env.VITE_STRIPE_PUBLIC_KEY },
            { label: 'i18n', ok: true },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(255,255,255,0.7)' }}>{s.label}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 700, color: s.ok ? '#4ade80' : '#f87171', letterSpacing: '0.1em' }}>{s.ok ? '✓ Connected' : '✗ Not configured'}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
