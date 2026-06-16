import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Search, Menu, X, ShoppingBag } from 'lucide-react'
import BookingModal from '../ui/BookingModal'
import CartDrawer from '../ui/CartDrawer'
import LanguageToggle from './LanguageToggle'
import { useCart } from '../../context/CartContext'

const navKeys = [
  { to: '/',                  key: 'nav.home' },
  { to: '/spa',               key: 'nav.spa' },
  { to: '/medispa',           key: 'nav.medispa' },
  { to: '/boutique',          key: 'nav.boutique' },
  { to: '/gourmet',           key: 'nav.gourmet' },
  { to: '/gifts',             key: 'nav.gifts' },
  { to: '/gift-certificates', key: 'nav.giftCertificates' },
  { to: '/blog',              key: 'nav.blog' },
]

export default function Navbar() {
  const { t } = useTranslation()
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [cartOpen,  setCartOpen]  = useState(false)
  const { itemCount } = useCart()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const linkStyle = ({ isActive }) => ({
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    fontSize: '0.68rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: isActive ? '#E9B0B9' : 'rgba(246,245,237,0.85)',
    textDecoration: 'none',
    padding: '4px 0',
    borderBottom: isActive ? '1px solid #E9B0B9' : '1px solid transparent',
    transition: 'color 0.2s',
    whiteSpace: 'nowrap',
  })

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500,
        height: '72px', display: 'flex', alignItems: 'center',
        transition: 'background 0.4s ease, box-shadow 0.4s ease',
        background: scrolled ? 'rgba(46,51,80,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? 'var(--shadow-nav)' : 'none',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', height: '100%', gap: 0 }}>

          {/* ── Sparivier Logo ── */}
          <NavLink to="/" aria-label="Sparivier home" style={{ textDecoration: 'none', flexShrink: 0, marginRight: 'var(--space-xl)' }}>
            <img
              src="/logo.png"
              alt="Sparivier"
              style={{ height: '54px', width: 'auto', display: 'block', filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.18))' }}
            />
          </NavLink>

          {/* Desktop nav */}
          <ul style={{ display: 'flex', gap: 'var(--space-lg)', listStyle: 'none', margin: '0 auto', padding: 0, alignItems: 'center' }} className="nav-desktop">
            {navKeys.map(l => (
              <li key={l.to} style={{ whiteSpace: 'nowrap' }}>
                <NavLink to={l.to} end={l.to === '/'} style={linkStyle}>{t(l.key)}</NavLink>
              </li>
            ))}
          </ul>

          {/* Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', flexShrink: 0, marginLeft: 'var(--space-xl)' }}>
            <LanguageToggle />
            <button aria-label="Search" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(246,245,237,0.8)', display: 'flex', padding: '4px' }}>
              <Search size={18} />
            </button>
            {/* Cart icon */}
            <button onClick={() => setCartOpen(true)}
              aria-label={`Shopping cart — ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(246,245,237,0.85)', display: 'flex', padding: '4px', position: 'relative' }}>
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span aria-hidden="true" style={{
                  position: 'absolute', top: '-4px', right: '-6px',
                  background: '#E9B0B9', color: '#2E3350',
                  borderRadius: '50%', width: '18px', height: '18px',
                  fontSize: '0.6rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  lineHeight: 1,
                }}>
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>
            <button className="btn-secondary" onClick={() => setModalOpen(true)}
              style={{ padding: '10px 22px', fontSize: '0.68rem' }}
              aria-label={t('cta.book')}>
              {t('cta.book')}
            </button>
            <button
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen(m => !m)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-white)', display: 'flex', padding: '4px' }}
              className="hamburger">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 490,
          background: 'var(--color-blue)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 'var(--space-xl)',
        }}>
          {/* Mobile logo */}
          <div style={{ marginBottom: 'var(--space-lg)', textAlign: 'center' }}>
            <img
              src="/logo.png"
              alt="Sparivier"
              style={{ height: '88px', width: 'auto', display: 'block', margin: '0 auto' }}
            />
          </div>

          {navKeys.map(l => (
            <NavLink
              key={l.to} to={l.to} end={l.to === '/'}
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.2rem, 4vw, 2rem)',
                fontWeight: 200,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: isActive ? '#E9B0B9' : 'var(--color-white)',
                textDecoration: 'none',
              })}>
              {t(l.key)}
            </NavLink>
          ))}

          <button className="btn-primary"
            onClick={() => { setMenuOpen(false); setModalOpen(true) }}
            style={{ marginTop: 'var(--space-lg)' }}>
            {t('cta.book')}
          </button>
        </div>
      )}

      <BookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <style>{`
        @media (min-width: 1025px) { .hamburger { display: none !important; } }
        @media (max-width: 1024px) { .nav-desktop { display: none !important; } }
      `}</style>
    </>
  )
}
