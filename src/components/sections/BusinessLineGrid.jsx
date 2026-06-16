import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SectionHeader from '../ui/SectionHeader'

const LINE_META = [
  { to: '/spa',               image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=1000&fit=crop&q=80', key: 'spa' },
  { to: '/medispa',           image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=1000&fit=crop&q=80', key: 'medispa' },
  { to: '/boutique',          image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&h=1000&fit=crop&q=80', key: 'boutique' },
  { to: '/gourmet',           image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=1000&fit=crop&q=80', key: 'gourmet' },
  { to: '/gifts',             image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=800&h=1000&fit=crop&q=80', key: 'gifts' },
  { to: '/gift-certificates', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&h=1000&fit=crop&q=80', key: 'certs' },
]

export default function BusinessLineGrid() {
  const { t } = useTranslation()

  const lines = LINE_META.map(m => ({
    ...m,
    eyebrow: t(`grid.${m.key}.eyebrow`),
    title:   t(`grid.${m.key}.title`),
    desc:    t(`grid.${m.key}.desc`),
  }))

  return (
    <section style={{ background: 'var(--color-white)', padding: 'var(--space-3xl) var(--space-xl)' }}>
      <div className="container">
        <SectionHeader
          eyebrow={t('grid.eyebrow')}
          headline={t('grid.headline')}
          subtext={t('grid.sub')}
          align="center"
        />

        {/* Featured Spa card — wide cinematic banner */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <NavLink to="/spa" style={{ textDecoration: 'none', display: 'block' }}>
            <div
              style={{ position: 'relative', height: '360px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', cursor: 'pointer', boxShadow: 'var(--shadow-hover)', transition: 'transform 0.4s ease, box-shadow 0.4s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 32px 90px rgba(46,51,80,0.28)'; e.currentTarget.querySelector('img').style.transform = 'scale(1.05)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; e.currentTarget.querySelector('img').style.transform = 'scale(1)' }}>
              <img src={lines[0].image} alt="Sparivier Spa" loading="lazy"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', transition: 'transform 0.7s ease' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(46,51,80,0.88) 0%, rgba(46,51,80,0.4) 55%, transparent 100%)' }} />
              <div style={{ position: 'absolute', top: '50%', left: 'var(--space-3xl)', transform: 'translateY(-50%)', maxWidth: '520px' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-sm)' }}>✦ {lines[0].eyebrow}</p>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 200, color: '#F6F5ED', marginBottom: 'var(--space-sm)', lineHeight: 1.15 }}>{lines[0].title}</h2>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', fontWeight: 300, color: 'rgba(246,245,237,0.82)', lineHeight: 1.7, marginBottom: 'var(--space-lg)' }}>{lines[0].desc}</p>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E9B0B9', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {t('cta.explore')} <span style={{ fontSize: '1.1rem' }}>→</span>
                </span>
              </div>
            </div>
          </NavLink>
        </div>

        {/* Remaining 5 cards */}
        <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-xl)' }}>
          {lines.slice(1).map(line => (
            <NavLink key={line.to} to={line.to} style={{ textDecoration: 'none' }}>
              <div
                style={{ position: 'relative', height: '400px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', cursor: 'pointer', boxShadow: 'var(--shadow-card)', transition: 'transform 0.35s ease, box-shadow 0.35s ease' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lifted)'; e.currentTarget.querySelector('img').style.transform = 'scale(1.06)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; e.currentTarget.querySelector('img').style.transform = 'scale(1)' }}>
                <img src={line.image} alt={line.title} loading="lazy"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transition: 'transform 0.6s ease' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(46,51,80,0.90) 0%, rgba(46,51,80,0.22) 55%, transparent 100%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'var(--space-xl)' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-sm)' }}>{line.eyebrow}</p>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.85rem', fontWeight: 200, color: '#F6F5ED', marginBottom: 'var(--space-sm)', lineHeight: 1.15 }}>{line.title}</h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 300, color: 'rgba(246,245,237,0.80)', lineHeight: 1.65, marginBottom: 'var(--space-md)' }}>{line.desc}</p>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#E9B0B9', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {t('cta.explore')} <span style={{ fontSize: '1rem' }}>→</span>
                  </span>
                </div>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </section>
  )
}
