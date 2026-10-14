import { Link } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import { supabase } from '../../lib/supabase'

export default function AdminDashboard() {
  return (
    <AdminLayout title="Dashboard">
      {!supabase && (
        <div style={{ background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.25)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-alert)' }}>
            <strong>Supabase not configured.</strong> Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to the .env file to enable live data. The admin interface will display live statistics and full data management once connected.
          </p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-xl)' }}>
        <div style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)', boxShadow: 'var(--shadow-card)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)', marginBottom: 'var(--space-lg)' }}>Quick Links</h2>
          {[
            { href: '/admin/gifts', label: 'Gift Certificates' },
            { href: '/admin/services', label: 'Edit Services & Pricing' },
            { href: '/admin/promotions', label: 'Edit Promotions' },
            { href: '/admin/boutique', label: 'Boutique Brands' },
          ].map(link => (
            <Link key={link.href} to={link.href} style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-plum-soft)', textDecoration: 'none', padding: '8px 0', borderBottom: '1px solid var(--lavelle-cream)' }}>
              → {link.label}
            </Link>
          ))}
        </div>

        <div style={{ background: 'linear-gradient(135deg, var(--lavelle-plum-deep) 0%, var(--lavelle-plum-mid) 100%)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)', boxShadow: 'var(--shadow-card)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, color: 'var(--lavelle-gold-champagne)', marginBottom: 'var(--space-md)' }}>System Status</h2>
          {[
            { label: 'Supabase', ok: !!supabase },
            { label: 'Stripe', ok: !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY },
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
