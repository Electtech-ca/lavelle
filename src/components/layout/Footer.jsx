import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Instagram, Facebook, MapPin } from 'lucide-react'

const navLinks = [
  { to: '/',                  key: 'nav.home' },
  { to: '/spa',               key: 'nav.spa' },
  { to: '/medispa',           key: 'nav.medispa' },
  { to: '/boutique',          key: 'nav.boutique' },
  { to: '/gourmet',           key: 'nav.gourmet' },
  { to: '/gifts',             key: 'nav.gifts' },
  { to: '/gift-certificates', key: 'nav.giftCertificates' },
  { to: '/blog',              key: 'nav.blog' },
]

export default function Footer() {
  const { t } = useTranslation()

  const hours = [
    { days: t('footer.hours.monWed'), time: t('footer.hours.time1') },
    { days: t('footer.hours.thuFri'), time: t('footer.hours.time2') },
    { days: t('footer.hours.sat'),    time: t('footer.hours.time3') },
    { days: t('footer.hours.sun'),    time: t('footer.hours.time4') },
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

  return (
    <footer style={{ background: '#2E3350', color: '#F6F5ED', paddingTop: 'var(--space-3xl)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-2xl)', paddingBottom: 'var(--space-3xl)' }}>

          {/* Brand */}
          <div>
            <NavLink to="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: 'var(--space-lg)' }}>
              <img
                src="/logo.png"
                alt="Sparivier"
                style={{ height: '80px', width: 'auto', display: 'block' }}
              />
            </NavLink>
            <p style={{ ...body, fontStyle: 'italic', marginBottom: 'var(--space-lg)' }}>{t('footer.tagline')}</p>
            <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
              {[
                { Icon: Instagram, label: 'Instagram',   href: '#' },
                { Icon: Facebook,  label: 'Facebook',    href: '#' },
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

          {/* Quick Links + Hours */}
          <div>
            <p style={colHead}>{t('footer.quickLinks')}</p>
            <ul style={{ marginBottom: 'var(--space-xl)' }}>
              {navLinks.map(l => (
                <li key={l.to} style={{ marginBottom: 'var(--space-sm)' }}>
                  <NavLink to={l.to} style={{ ...body, textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#E9B0B9' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(246,245,237,0.65)' }}>
                    {t(l.key)}
                  </NavLink>
                </li>
              ))}
            </ul>
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
              <p style={{ ...body, marginBottom: 'var(--space-md)' }}>353 Reid Street<br />Downtown Quesnel, BC</p>
              <p style={{ marginBottom: 'var(--space-sm)' }}>
                <a href="tel:+12509928084" style={{ ...body, textDecoration: 'none' }}>250-992-8084</a>
              </p>
              <p>
                <a href="mailto:hello@sparivier.ca" style={{ ...body, textDecoration: 'none', color: '#E9B0B9' }}>hello@sparivier.ca</a>
              </p>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(233,176,185,0.2)', padding: 'var(--space-lg) 0', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 300, color: 'rgba(246,245,237,0.40)' }}>
            {t('footer.copyright')} · {t('footer.built')}
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
