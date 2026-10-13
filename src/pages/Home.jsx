import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import HeroBanner       from '../components/sections/HeroBanner'
import BusinessLineGrid from '../components/sections/BusinessLineGrid'
import AwardsSection    from '../components/sections/AwardsSection'
import Sentences        from '../components/ui/Sentences'
import GoldDivider      from '../components/ui/GoldDivider'
import { yearsInBusiness } from '../data/business'

const FAMILY_PHOTO  = '/images/team/family-smiling.jpg'   // the three women behind Spa Rivier, in the boutique

export default function Home() {
  const { t } = useTranslation()
  const { hash, key } = useLocation()
  const years = yearsInBusiness()

  // Links can point at sections here (/#experience). React Router does not
  // scroll to a #hash, so bring the section up.
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

      {/* ── The family behind Spa Rivier: the short story; the full one is on the Team page ── */}
      <section style={{ background: 'var(--color-cream)', padding: 'var(--space-xl) var(--space-xl)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: 'var(--space-xl)', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-pink)', marginBottom: 'var(--space-sm)' }}>✦ {t('home.family.eyebrow')}</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 200, color: 'var(--color-blue)', lineHeight: 1.2, marginBottom: 'var(--space-xl)', textWrap: 'balance' }}>
              <Sentences text={t('home.family.headline')} />
            </h2>
            {['home.family.body1', 'home.family.body2', 'home.family.body3', 'home.family.body4'].map(k => (
              <p key={k} style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 'var(--text-body)', color: 'var(--lavelle-charcoal)', lineHeight: 1.85, marginBottom: 'var(--space-lg)' }}>
                {t(k)}
              </p>
            ))}
            <div className="cta-center" style={{ marginTop: 'var(--space-sm)' }}>
              <Link to="/team" className="btn-primary">{t('nav.team')}</Link>
            </div>
          </div>

          <img src={FAMILY_PHOTO} alt={t('home.family.photoAlt')} loading="lazy"
            style={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', objectPosition: 'center 30%', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-hover)', display: 'block' }} />
        </div>
      </section>

      <AwardsSection />
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
