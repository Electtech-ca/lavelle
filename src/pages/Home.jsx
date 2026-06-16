import { useTranslation } from 'react-i18next'
import HeroBanner       from '../components/sections/HeroBanner'
import BusinessLineGrid from '../components/sections/BusinessLineGrid'
import TeamSection      from '../components/sections/TeamSection'
import AwardsSection    from '../components/sections/AwardsSection'
import NewsletterSignup from '../components/sections/NewsletterSignup'
import SectionHeader    from '../components/ui/SectionHeader'
import GoldDivider      from '../components/ui/GoldDivider'

const STORY_IMAGE   = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=900&h=1000&fit=crop&q=85'
const FEATURE_IMGS  = [
  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=700&fit=crop&q=80',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=700&fit=crop&q=80',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=700&fit=crop&q=80',
]

export default function Home() {
  const { t } = useTranslation()

  const stats = [
    { value: '35+', label: t('home.stats.years') },
    { value: '5',   label: t('home.stats.experiences') },
    { value: '12+', label: t('home.stats.awards') },
    { value: '∞',   label: t('home.stats.moments') },
  ]

  return (
    <>
      <HeroBanner />

      {/* Stats strip */}
      <div style={{ background: 'var(--color-blue)', padding: 'var(--space-2xl) var(--space-xl)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-xl)', textAlign: 'center' }}>
            {stats.map(s => (
              <div key={s.label}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 200, color: '#E9B0B9', lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(246,245,237,0.55)', marginTop: 'var(--space-sm)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BusinessLineGrid />
      <GoldDivider />

      {/* Brand story */}
      <section style={{ background: 'var(--color-cream)', padding: 'var(--space-3xl) var(--space-xl)', overflow: 'hidden' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-3xl)', alignItems: 'center' }}>
          <div>
            <SectionHeader
              eyebrow={t('home.story.eyebrow')}
              headline={t('home.story.headline')}
              subtext={t('home.story.sub')}
            />
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 'var(--text-body)', color: 'var(--lavelle-gray-mid)', lineHeight: 1.85, marginBottom: 'var(--space-xl)' }}>
              {t('home.story.body')}
            </p>
            <a href="/spa" className="btn-primary">{t('home.story.cta')}</a>
          </div>

          {/* Story image — elegant tall crop with gold border accent */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', top: '-16px', left: '-16px',
              width: '60%', height: '60%',
              border: '2px solid #E9B0B9', borderRadius: 'var(--radius-xl)',
              opacity: 0.35, pointerEvents: 'none',
            }} />
            <img src={STORY_IMAGE} alt="Sparivier luxury interior — opulence and beauty" loading="lazy"
              style={{ width: '100%', height: '520px', objectFit: 'cover', objectPosition: 'center', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-hover)', display: 'block' }} />
            <div style={{
              position: 'absolute', bottom: 'var(--space-xl)', left: 'var(--space-xl)',
              background: 'rgba(46,51,80,0.88)', backdropFilter: 'blur(8px)',
              borderRadius: 'var(--radius-lg)', padding: 'var(--space-md) var(--space-lg)',
              border: '1px solid rgba(233,176,185,0.30)',
            }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontStyle: 'italic', color: '#E9B0B9', lineHeight: 1.4 }}>
                {t('home.quote')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3-photo feature strip */}
      <section style={{ background: 'var(--color-blue)', padding: 'var(--space-2xl) var(--space-xl)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-lg)' }}>
            {[
              { img: FEATURE_IMGS[0], label: t('home.features.spa.label'),     sub: t('home.features.spa.sub'),     href: '/spa' },
              { img: FEATURE_IMGS[1], label: t('home.features.salon.label'),   sub: t('home.features.salon.sub'),   href: '/medispa' },
              { img: FEATURE_IMGS[2], label: t('home.features.gourmet.label'), sub: t('home.features.gourmet.sub'), href: '/gourmet' },
            ].map(f => (
              <a key={f.label} href={f.href} style={{ textDecoration: 'none', display: 'block', position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '220px' }}>
                <img src={f.img} alt={f.label} loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transition: 'transform 0.5s ease', display: 'block' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(46,51,80,0.88) 0%, rgba(46,51,80,0.1) 60%, transparent 100%)' }} />
                <div style={{ position: 'absolute', bottom: 'var(--space-md)', left: 'var(--space-md)' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 200, color: '#F6F5ED', lineHeight: 1.2 }}>{f.label}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, color: '#E9B0B9', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '3px' }}>{f.sub}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── About Sparivier ── */}
      <section style={{ background: 'var(--color-white)', padding: 'var(--space-3xl) var(--space-xl)' }}>
        <div className="container">
          {/* Section label */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-pink)', marginBottom: 'var(--space-sm)' }}>✦ {t('home.about.eyebrow')}</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 200, color: 'var(--color-blue)', lineHeight: 1.2 }}>
              {t('home.about.headline')}
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', fontWeight: 300, color: 'var(--text-muted)', maxWidth: '600px', margin: 'var(--space-md) auto 0', lineHeight: 1.75 }}>
              {t('home.about.sub')}
            </p>
          </div>

          {/* 4-photo gallery */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-lg)', marginBottom: 'var(--space-2xl)' }}>
            {[
              { src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=420&fit=crop&q=80', alt: ' interior' },
              { src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=420&fit=crop&q=80', alt: 'Professional hair colour services' },
              { src: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=420&fit=crop&q=80', alt: 'Sparivier Spa sanctuary' },
              { src: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=420&fit=crop&q=80', alt: 'Nail bar artistry' },
            ].map(img => (
              <img key={img.alt} src={img.src} alt={img.alt} loading="lazy"
                style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', transition: 'transform 0.4s ease, box-shadow 0.4s ease' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = 'var(--shadow-hover)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)' }}
              />
            ))}
          </div>

          {/* Editorial text + quote */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-2xl)', alignItems: 'start' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 'var(--text-body)', color: 'var(--text-muted)', lineHeight: 1.9, marginBottom: 'var(--space-lg)' }}>
                {t('home.about.body1')}
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 'var(--text-body)', color: 'var(--text-muted)', lineHeight: 1.9, marginBottom: 'var(--space-xl)' }}>
                {t('home.about.body2')}
              </p>
              <a href="/spa" className="btn-primary">{t('home.about.cta')}</a>
            </div>
            <div style={{ background: 'var(--color-blue)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2xl)', border: '1px solid rgba(233,176,185,0.18)' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontStyle: 'italic', color: '#F6F5ED', lineHeight: 1.6, marginBottom: 'var(--space-lg)' }}>
                {t('home.about.quote')}
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: '#E9B0B9', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{t('home.about.attrib')}</p>
              <div style={{ marginTop: 'var(--space-xl)', paddingTop: 'var(--space-lg)', borderTop: '1px solid rgba(246,245,237,0.1)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
                {[
                  { value: '35+', label: t('home.about.stat1') },
                  { value: '4',   label: t('home.about.stat2') },
                  { value: '12+', label: t('home.about.stat3') },
                  { value: '∞',   label: t('home.about.stat4') },
                ].map(s => (
                  <div key={s.label}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 200, color: '#E9B0B9', lineHeight: 1 }}>{s.value}</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', color: 'rgba(246,245,237,0.5)', marginTop: '4px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <AwardsSection />
      <TeamSection preview />
      <GoldDivider />
      <NewsletterSignup />
    </>
  )
}
