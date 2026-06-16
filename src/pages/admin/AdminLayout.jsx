import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import {
  LayoutDashboard, CalendarDays, Scissors, Gift,
  Tag, Users, Mail, CreditCard, LogOut, ExternalLink, ShoppingBag
} from 'lucide-react'

const navItems = [
  { to: '/admin',             label: 'Dashboard',         Icon: LayoutDashboard, end: true },
  { to: '/admin/bookings',    label: 'Bookings',          Icon: CalendarDays },
  { to: '/admin/payments',    label: 'Payments & Orders', Icon: CreditCard },
  { to: '/admin/products',    label: 'Products',          Icon: ShoppingBag },
  { to: '/admin/services',    label: 'Services',          Icon: Scissors },
  { to: '/admin/gifts',       label: 'Gifts & Hampers',   Icon: Gift },
  { to: '/admin/promotions',  label: 'Promotions',        Icon: Tag },
  { to: '/admin/members',     label: 'Members',           Icon: Users },
  { to: '/admin/newsletter',  label: 'Newsletter',        Icon: Mail },
]

export default function AdminLayout({ children, title }) {
  const { signOut, user } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/admin/login')
  }

  const linkStyle = ({ isActive }) => ({
    display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px',
    borderRadius: 'var(--radius-md)', textDecoration: 'none',
    fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 500,
    color: isActive ? '#F6F5ED' : 'rgba(246,245,237,0.55)',
    background: isActive ? 'rgba(233,176,185,0.15)' : 'transparent',
    transition: 'all 0.2s',
    borderLeft: isActive ? '3px solid #E9B0B9' : '3px solid transparent',
  })

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--lavelle-ivory)' }}>
      {/* Sidebar */}
      <aside style={{ width: '240px', background: 'var(--lavelle-plum-deep)', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        <div style={{ padding: 'var(--space-lg)', borderBottom: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
          <img
            src="/logo.png"
            alt="Sparivier"
            style={{ height: '66px', width: 'auto', display: 'block', margin: '0 auto 6px' }}
          />
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(233,176,185,0.65)' }}>Admin</p>
        </div>

        <nav style={{ padding: 'var(--space-md)', flex: 1 }}>
          {navItems.map(({ to, label, Icon, end }) => (
            <NavLink key={to} to={to} end={end} style={linkStyle}>
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: 'var(--space-md)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginBottom: 'var(--space-sm)', padding: '0 16px' }}>{user?.email}</p>
          <a href="/" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>
            <ExternalLink size={14} /> View Site
          </a>
          <button onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(255,255,255,0.45)', background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{ background: 'var(--lavelle-white)', borderBottom: '1px solid var(--lavelle-cream)', padding: 'var(--space-lg) var(--space-2xl)', display: 'flex', alignItems: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)' }}>{title}</h1>
        </header>
        <main style={{ flex: 1, padding: 'var(--space-2xl)', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
