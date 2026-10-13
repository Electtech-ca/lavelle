import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Instagram, Facebook, Store, MapPin, Phone } from 'lucide-react'

/* The client's order. Our Story and Meet the Team are sections of the homepage
   for now. Gourmet stays hidden. */
const quickLinks = [
  { to: '/',                      key: 'nav.home' },
  { to: '/spa',                   key: 'nav.spa' },
  { to: '/medispa',               key: 'nav.medispa' },
  { to: '/salon',                 key: 'nav.salon' },
  { to: '/boutique',              key: 'nav.boutique' },
  { to: '/haircare',              key: 'nav.haircare' },
  { to: '/skincare',              key: 'nav.skincare' },
  { to: '/bath-body',             key: 'nav.bathbody' },
  { to: '/giftware',              key: 'nav.giftware' },
  { to: '/giftware#certificates', key: 'nav.certificates' },
  { to: '/blog',                  key: 'nav.blog' },
  { to: '/#our-story',            key: 'nav.story' },
  { to: '/#team',                 key: 'nav.team' },
]

const DIRECTIONS = 'https://www.google.com/maps/dir/?api=1&destination=Spa+Rivier%2C+353+Reid+Street%2C+Quesnel%2C+BC'

export default function Footer() {
  const { t } = useTranslation()

  const hours = [
    { days: t('footer.hours.monSat'), time: t('footer.hours.open') },
    { days: t('footer.hours.sun'),    time: t('footer.hours.closed') },
  ]

  const colHead = {
    fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600,
    letterSpacing: '0.16em', textTransform: 'uppercase',
    color: '#E9B0B9', marginBottom: 'var(--space-lg)',
  }
  const body = {
    fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)',
    fontWeight: 300, color: 'rgba(246,245,237,0.65)', lineHeight: 1.8,
  }
  // Address and phone: brighter than the rest, each a link (directions, call)
  const contact = { ...body, color: 'rgba(246,245,237,0.92)', display: 'flex', alignItems: 'flex-start', gap: '10px', textDecoration: 'none' }
  const contactIcon = { color: '#E9B0B9', flexShrink: 0, marginTop: '5px' }

  return (
    <footer className="site-footer" style={{ background: '#2E3350', color: '#F6F5ED', paddingTop: '48px' }}>
      <div className="container site-footer-container">
        <div className="site-footer-grid" style={{ paddingBottom: 'var(--space-sm)' }}>

          {/* Brand */}
          <div>
            <NavLink to="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: 'var(--space-lg)' }}>
              <img
                src="/logo.png"
                alt="Spa Rivier"
                style={{ height: '80px', width: 'auto', display: 'block' }}
              />
            </NavLink>
            <p style={{ ...body, fontStyle: 'italic', marginBottom: 'var(--space-lg)' }}>{t('footer.tagline')}</p>
            <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
              {[
                { Icon: Instagram, label: 'Instagram',   href: 'https://www.instagram.com/sparivier/' },
                { Icon: Facebook,  label: 'Facebook',    href: 'https://www.facebook.com/Sparivierquesnel/' },
                /* Plain http on purpose: downtownquesnel.com's HTTPS certificate
                   expired in 2019, so an https link opens on a browser security
                   warning. Switch to https once their certificate is renewed. */
                { Icon: Store,     label: 'Downtown Quesnel', href: 'http://www.downtownquesnel.com/businesses/profile/45/spa_rivier/' },
                { Icon: MapPin,    label: 'Google Maps', href: 'https://maps.google.com/?q=353+Reid+Street+Quesnel+BC' },
              ].map(({ Icon, label, href }) => (
                <a key={label} href={href} aria-label={label}
                  target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '50%', border: '1px solid rgba(233,176,185,0.4)', color: '#E9B0B9', transition: 'all 0.2s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(233,176,185,0.15)'; e.currentTarget.style.borderColor = '#E9B0B9' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(233,176,185,0.4)' }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links — a page opens at its top; a #section link scrolls to that section */}
          <div>
            <p style={colHead}>{t('footer.quickLinks')}</p>
            <ul style={{ marginBottom: 'var(--space-xl)', columns: 2, columnGap: 'var(--space-lg)' }}>
              {quickLinks.map(l => (
                <li key={l.to} style={{ marginBottom: 'var(--space-sm)', breakInside: 'avoid' }}>
                  <NavLink to={l.to} style={{ ...body, textDecoration: 'none', transition: 'color 0.2s' }}
                    onClick={() => { if (!l.to.includes('#')) window.scrollTo({ top: 0, left: 0, behavior: 'auto' }) }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#E9B0B9' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(246,245,237,0.65)' }}>
                    {t(l.key)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <p style={colHead}>{t('footer.hours')}</p>
            <ul>
              {hours.map(h => (
                <li key={h.days} style={{ ...body, display: 'flex', justifyContent: 'space-between', gap: 'var(--space-md)', marginBottom: '5px' }}>
                  <span>{h.days}</span>
                  <span style={{ color: 'rgba(246,245,237,0.85)' }}>{h.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p style={colHead}>{t('footer.contact')}</p>
            <address style={{ fontStyle: 'normal' }}>
              <a href={DIRECTIONS} target="_blank" rel="noreferrer" title={t('footer.directions')} className="footer-contact-link" style={{ ...contact, marginBottom: 'var(--space-md)' }}>
                <MapPin size={15} style={contactIcon} aria-hidden="true" />
                <span>353 Reid Street<br />Downtown Quesnel, BC</span>
              </a>
              <a href="tel:+12509928084" className="footer-contact-link" style={contact}>
                <Phone size={15} style={contactIcon} aria-hidden="true" />
                <span>250-992-8084</span>
              </a>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(233,176,185,0.2)', padding: 'var(--space-lg) 0', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 300, color: 'rgba(246,245,237,0.40)' }}>
            {t('footer.copyright')} · {t('footer.built')} · {t('footer.poweredBy')}{' '}
            <a href="https://www.electtech.ca" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
              Elect Technologies
            </a>
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-lg)' }}>
            {['footer.privacy', 'footer.terms'].map(key => (
              <a key={key} href="#" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 300, color: 'rgba(246,245,237,0.40)', textDecoration: 'none' }}>
                {t(key)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
