import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import HeroBanner       from '../components/sections/HeroBanner'
import BusinessLineGrid from '../components/sections/BusinessLineGrid'
import TeamSection      from '../components/sections/TeamSection'
import AwardsSection    from '../components/sections/AwardsSection'
import SectionHeader    from '../components/ui/SectionHeader'
import GoldDivider      from '../components/ui/GoldDivider'
import { yearsInBusiness } from '../data/business'

const STORY_IMAGE   = '/images/boutique/boutique-interior.jpg'

/* Staff at work, until the client sends a team photo with both the service
   and the retail side in it. */
const TEAM_PHOTOS = [
  { src: '/images/team/donna.jpg',          alt: 'home.team.photo.owner', pos: 'center 20%' },
  { src: '/images/home/salon-service.jpg',  alt: 'home.team.photo.salon', pos: '70% center' },
  { src: '/images/home/nail-bar.jpg',       alt: 'home.team.photo.nails', pos: 'center 40%' },
  { src: '/images/home/spa-treatment.jpg',  alt: 'home.team.photo.spa',   pos: 'center 30%' },
]

export default function Home() {
  const { t } = useTranslation()
  const { hash, key } = useLocation()
  const years = yearsInBusiness()

  // "Our Story" and "Meet the Team" live on this page for now (/#our-story,
  // /#team). React Router does not scroll to a #hash, so bring the section up.
  useEffect(() => {
    if (!hash) return
    const id = setTimeout(() => {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
    return () => clearTimeout(id)
  }, [hash, key])

  const stats = [
    { title: t('home.stats.years', { years }), sub: t('home.stats.years.sub') },
    { title: t('home.stats.family'),           sub: t('home.stats.family.sub') },
    { title: t('home.stats.downtown'),         sub: t('home.stats.downtown.sub') },
    { title: t('home.stats.more'),             sub: t('home.stats.more.sub') },
  ]

  return (
    <>
      <HeroBanner />

      {/* Stats strip */}
      <div style={{ background: 'var(--color-blue)', padding: 'var(--space-2xl) var(--space-xl)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-xl)', textAlign: 'center' }}>
            {stats.map(s => (
              <div key={s.title}>
                {/* Two lines tall whether it wraps or not, so the lines beneath stay level */}
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.05rem, 1.6vw, 1.3rem)', fontWeight: 300, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#E9B0B9', lineHeight: 1.25, minHeight: '2.5em', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', textWrap: 'balance' }}>{s.title}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 300, color: 'rgba(246,245,237,0.78)', marginTop: 'var(--space-sm)', lineHeight: 1.5 }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BusinessLineGrid />
      <GoldDivider />

      {/* Brand story */}
      <section id="our-story" style={{ background: 'var(--color-cream)', padding: 'var(--space-3xl) var(--space-xl)', overflow: 'hidden', scrollMarginTop: '72px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-3xl)', alignItems: 'center' }}>
          <div>
            <SectionHeader
              eyebrow={t('home.story.eyebrow')}
              headline={t('home.story.headline', { years })}
              subtext={t('home.story.sub')}
            />
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 'var(--text-body)', color: 'var(--lavelle-gray-mid)', lineHeight: 1.85, marginBottom: 'var(--space-xl)' }}>
              {t('home.story.body')}
            </p>
            <div className="cta-center">
              <a href="/spa" className="btn-primary">{t('home.story.cta')}</a>
            </div>
          </div>

          {/* Story image — elegant tall crop with gold border accent */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', top: '-16px', left: '-16px',
              width: '60%', height: '60%',
              border: '2px solid #E9B0B9', borderRadius: 'var(--radius-xl)',
              opacity: 0.35, pointerEvents: 'none',
            }} />
            <img src={STORY_IMAGE} alt="Spa Rivier luxury interior — opulence and beauty" loading="lazy"
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

      {/* ── The people behind Spa Rivier ── */}
      <section style={{ background: 'var(--color-white)', padding: 'var(--space-3xl) var(--space-xl)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: 'var(--space-3xl)', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-pink)', marginBottom: 'var(--space-sm)' }}>✦ {t('home.team.eyebrow')}</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 200, color: 'var(--color-blue)', lineHeight: 1.2, marginBottom: 'var(--space-xl)' }}>
              {t('home.team.headline')}
            </h2>
            {['home.team.body1', 'home.team.body2', 'home.team.body3'].map(k => (
              <p key={k} style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 'var(--text-body)', color: 'var(--lavelle-charcoal)', lineHeight: 1.85, marginBottom: 'var(--space-lg)' }}>
                {t(k)}
              </p>
            ))}
            <Link to="/#team" className="btn-primary" style={{ marginTop: 'var(--space-sm)' }}>{t('home.team.cta')}</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 'var(--space-md)' }}>
            {TEAM_PHOTOS.map(p => (
              <img key={p.src} src={p.src} alt={t(p.alt)} loading="lazy"
                style={{ width: '100%', aspectRatio: '4 / 5', objectFit: 'cover', objectPosition: p.pos, borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', display: 'block' }} />
            ))}
          </div>
        </div>
      </section>

      <AwardsSection />
      <TeamSection preview id="team" />
      <GoldDivider />

      {/* ── What's new: the What's Happening page in place of the email signup ── */}
      <section style={{ background: 'var(--lavelle-plum-mid)', padding: 'var(--space-2xl) var(--space-xl)', textAlign: 'center', borderBottom: '1px solid rgba(233,176,185,0.2)' }}>
        <div style={{ maxWidth: '620px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 300, color: 'var(--lavelle-white)', marginBottom: 'var(--space-md)', lineHeight: 1.2 }}>{t('home.whatsNew.headline')}</h2>
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 'var(--text-body)', color: 'rgba(255,255,255,0.78)', marginBottom: 'var(--space-xl)', lineHeight: 1.7 }}>{t('home.whatsNew.sub')}</p>
          <Link to="/blog" className="btn-primary">{t('nav.blog')}</Link>
        </div>
      </section>
    </>
  )
}
