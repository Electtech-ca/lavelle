import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import SectionHeader    from '../components/ui/SectionHeader'
import GiftCard         from '../components/ui/GiftCard'
import GoldDivider      from '../components/ui/GoldDivider'
import NewsletterSignup from '../components/sections/NewsletterSignup'
import GiftCertificateSection from '../components/sections/GiftCertificateSection'
import { giftItems }    from '../data/giftsData'
import { promotions, loyaltyTiers } from '../data/promotionsData'
import { promotionTranslations, loyaltyTranslations } from '../data/promotionTranslations'

const PROMO_IMAGES = [
  '/images/gifts/voluspa-holiday-set.jpg',
  '/images/gifts/tokyomilk-honey-moon-kit.jpg',
  '/images/gifts/candle-diffuser-kitchen.jpg',
  '/images/gifts/lof-true-vanilla.jpg',
  '/images/gifts/voluspa-mercury-glass.jpg',
  '/images/gifts/voluspa-cherry-gloss.jpg',
  '/images/gifts/candle-diffuser-tray.jpg',
]

const LOYALTY_IMAGES = [
  '/images/gifts/voluspa-pomegranate.jpg',
  '/images/gifts/voluspa-lavender.jpg',
  '/images/spa/bath-ritual.jpg',
]

const categoryMap = {
  'Hampers & Sets':         [1, 8, 20],
  'Lifestyle':              [2, 3, 5, 6, 13, 14, 16, 17, 18, 19],
  'Skincare & Beauty':      [4, 10, 11, 15],
  'Jewellery & Accessories':[7, 9, 12],
}

export default function Giftware() {
  const { t, i18n } = useTranslation()
  const isFrench = i18n.language.startsWith('fr')
  const [category, setCategory] = useState('all')

  // React Router does not honour a #hash on navigation, so a link arriving
  // from another page at /giftware#certificates would land at the top.
  useEffect(() => {
    if (window.location.hash !== '#certificates') return
    const id = setTimeout(() => {
      document.getElementById('certificates')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
    return () => clearTimeout(id)
  }, [])

  const CATEGORIES = [
    { key: 'all',       label: t('gifts.cat.all') },
    { key: 'hampers',   label: t('gifts.cat.hampers') },
    { key: 'lifestyle', label: t('gifts.cat.lifestyle') },
    { key: 'skincare',  label: t('gifts.cat.skincare') },
    { key: 'jewellery', label: t('gifts.cat.jewellery') },
    { key: 'gourmet',   label: t('gifts.cat.gourmet') },
    { key: 'seasonal',  label: t('gifts.cat.seasonal') },
    { key: 'bathBody',  label: t('gifts.cat.bathBody') },
    { key: 'kitchen',   label: t('gifts.cat.kitchen') },
    { key: 'candles',   label: t('gifts.cat.candles') },
    { key: 'home',      label: t('gifts.cat.home') },
    { key: 'kids',      label: t('gifts.cat.kids') },
  ]

  const categoryKeyMap = {
    hampers:   [1, 8, 20],
    lifestyle: [2, 3, 5, 6, 13, 14, 16, 17, 18, 19],
    skincare:  [4, 10, 11, 15],
    jewellery: [7, 9, 12],
    gourmet:   [21, 22, 23],

    /* Departments. An item can belong to several — a gift is rarely just
       one thing — so these overlap with the categories above by design. */
    seasonal:  [],                  // awaiting stock
    bathBody:  [4, 5, 11, 15],
    kitchen:   [6, 14, 22, 23],
    candles:   [3],
    home:      [2, 7, 13, 17],
    kids:      [],                  // awaiting stock
  }

  const visible = category === 'all'
    ? giftItems
    : giftItems.filter(g => (categoryKeyMap[category] || []).includes(g.id))

  return (
    <>
      {/* ── Page hero ── */}
      <div style={{ position: 'relative', height: '68vh', minHeight: '480px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <img
          src="/branding/Gifts.svg"
          alt="Spa Rivier Gifts & Hampers" loading="eager"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        {/* Multi-layer overlay for depth */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(49,58,77,0.75) 0%, rgba(20,25,38,0.55) 60%, rgba(49,58,77,0.7) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />

        {/* Floating decorative element */}
        <div style={{
          position: 'absolute', top: '20%', right: '10%', width: '180px', height: '180px',
          borderRadius: '50%', border: '1px solid rgba(228,62,45,0.2)',
          animation: 'float 6s ease-in-out infinite',
        }} className="animate-float" />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px', padding: 'calc(72px + var(--space-xl)) var(--space-xl) var(--space-xl)' }}>
          <p className="slide-in-up-1" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--lavelle-gold-champagne)', marginBottom: 'var(--space-md)' }}>
            ✦ {t('gifts.hero.eyebrow')}
          </p>
          <h1 className="slide-in-up-2" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h1)', fontWeight: 300, color: 'var(--lavelle-white)', lineHeight: 1.1, marginBottom: 'var(--space-md)', textShadow: '0 2px 30px rgba(0,0,0,0.5)', whiteSpace: 'pre-line' }}>
            {t('gifts.hero.headline')}
          </h1>
          <p className="slide-in-up-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '1.15rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, marginBottom: 'var(--space-xl)' }}>
            {t('gifts.hero.sub')}
          </p>
          <div className="slide-in-up-4" style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap', paddingBottom: 'var(--space-md)' }}>
            <a href="#certificates" className="btn-primary">{t('gifts.hero.cta2')}</a>
          </div>
        </div>
      </div>

      {/* ── Signature banner strip ── */}
      <div style={{ background: 'var(--lavelle-plum-deep)', padding: 'var(--space-xl) var(--space-xl)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-xl)', textAlign: 'center' }}>
          {[
            { icon: '🎁', label: t('gifts.features.wrapping'),   sub: t('gifts.features.wrapping.sub') },
            { icon: '🕯️', label: t('gifts.features.waxSeal'),    sub: t('gifts.features.waxSeal.sub') },
            { icon: '✍️', label: t('gifts.features.calligraphy'), sub: t('gifts.features.calligraphy.sub') },
            { icon: '🚚', label: t('gifts.features.delivery'),    sub: t('gifts.features.delivery.sub') },
          ].map(f => (
            <div key={f.label} className="slide-in-up">
              <p style={{ fontSize: '1.8rem', marginBottom: 'var(--space-sm)' }}>{f.icon}</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 600, color: 'var(--lavelle-gold-champagne)', marginBottom: '4px' }}>{f.label}</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', color: 'rgba(255,255,255,0.55)' }}>{f.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Gift grid ── */}
      <section style={{ background: 'var(--lavelle-ivory)', padding: 'var(--space-lg) var(--space-xl)' }}>
        <div className="container">
          <SectionHeader
            eyebrow={t('gifts.collection.eyebrow')}
            headline={t('gifts.collection.headline')}
            subtext={t('gifts.collection.sub')}
            align="center"
          />

          {/* Category filter */}
          <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 'var(--space-2xl)' }}>
            {CATEGORIES.map(c => (
              <button key={c.key} onClick={() => setCategory(c.key)}
                style={{
                  fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500,
                  letterSpacing: '0.1em', textTransform: 'uppercase', padding: '9px 20px',
                  borderRadius: 'var(--radius-full)', cursor: 'pointer',
                  border: category === c.key ? '1px solid var(--lavelle-gold-champagne)' : '1px solid var(--lavelle-cream)',
                  background: category === c.key ? 'var(--lavelle-plum-deep)' : 'var(--lavelle-white)',
                  color: category === c.key ? 'var(--lavelle-gold-champagne)' : 'var(--lavelle-gray-mid)',
                  transition: 'all 0.25s ease',
                }}>
                {c.label}
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-3xl) var(--space-xl)', background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }}>
              <p style={{ fontSize: '1.8rem', marginBottom: 'var(--space-md)' }} aria-hidden="true">✦</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 300, color: 'var(--lavelle-plum-deep)', marginBottom: 'var(--space-sm)' }}>
                {t('gifts.empty.heading')}
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', lineHeight: 1.75, maxWidth: '420px', margin: '0 auto' }}>
                {t('gifts.empty.sub')} <a href="tel:+12509928084" style={{ color: 'var(--lavelle-plum-soft)' }}>250-992-8084</a>.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-xl)' }}>
              {visible.map((g, i) => (
                <div key={g.id} className={`slide-in-up-${Math.min(i + 1, 6)}`}>
                  <GiftCard gift={g} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <GoldDivider />

      {/* ── Gift certificates (folded in from the old /gift-certificates page) ── */}
      <GiftCertificateSection />

      <GoldDivider />

      {/* ── Current Promotions ── */}
      <section style={{ background: 'var(--lavelle-ivory)', padding: 'var(--space-md) var(--space-xl)' }}>
        <div className="container">
          <SectionHeader
            eyebrow={t('gifts.promos.eyebrow')}
            headline={t('gifts.promos.headline')}
            subtext={t('gifts.promos.sub')}
            align="center"
          />
          <div className="promotion-grid" style={{ gap: 'var(--space-xl)' }}>
            {promotions.map((promo, i) => {
              const translation = isFrench ? promotionTranslations[promo.id] : null
              const displayTitle = translation?.[0] || promo.title
              const displayValue = translation?.[1] || promo.value
              const displayExpiry = translation?.[2] || promo.expiry
              const displayDescription = translation?.[3] || promo.description
              return (
              <div key={promo.id}
                style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-card)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = 'var(--shadow-hover)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)' }}>
                <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                  <img src={PROMO_IMAGES[i % PROMO_IMAGES.length]} alt={displayTitle} loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }} />
                  <div style={{ position: 'absolute', top: 'var(--space-md)', right: 'var(--space-md)', background: 'var(--lavelle-gold-champagne)', color: 'var(--lavelle-plum-deep)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 700 }}>
                    {displayValue}
                  </div>
                </div>
                <div style={{ padding: 'var(--space-xl)' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)', marginBottom: 'var(--space-sm)', lineHeight: 1.3 }}>{displayTitle}</h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', lineHeight: 1.75, marginBottom: 'var(--space-md)' }}>{displayDescription}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--lavelle-gold-champagne)' }}>{t('gifts.promos.valid')}: {displayExpiry}</p>
                </div>
              </div>
              )
            })}
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* ── Loyalty Programme ── */}
      <section style={{ background: 'var(--lavelle-plum-deep)', padding: 'var(--space-md) var(--space-xl)' }}>
        <div className="container">
          <SectionHeader
            eyebrow={t('gifts.loyalty.eyebrow')}
            headline={t('gifts.loyalty.headline')}
            subtext={t('gifts.loyalty.sub')}
            light align="center"
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}>
            {loyaltyTiers.map((tier, i) => {
              const translation = isFrench ? loyaltyTranslations[tier.tier] : null
              const displayTier = translation?.tier || tier.tier
              const displayRange = translation?.range || tier.range
              const displayBenefits = translation?.benefits || tier.benefits
              return (
              <div key={tier.tier} style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: i === 2 ? '1px solid rgba(228,62,45,0.5)' : '1px solid rgba(255,255,255,0.1)', boxShadow: i === 2 ? '0 0 40px rgba(228,62,45,0.12)' : 'none' }}>
                <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                  <img src={LOYALTY_IMAGES[i]} alt={`${displayTier} tier`} loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(49,58,77,0.6)' }} />
                  <div style={{ position: 'absolute', bottom: 'var(--space-md)', left: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                    <span style={{ fontSize: '1.8rem' }}>{tier.emoji}</span>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--lavelle-gold-champagne)' }}>{displayTier}</h3>
                  </div>
                </div>
                <div style={{ padding: 'var(--space-xl)', background: i === 2 ? 'rgba(228,62,45,0.08)' : 'rgba(255,255,255,0.05)' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', marginBottom: 'var(--space-lg)' }}>{displayRange}</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {displayBenefits.map(b => (
                      <li key={b} style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(255,255,255,0.82)', lineHeight: 2.1, display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--lavelle-gold-champagne)', marginTop: '7px', fontSize: '0.45rem', flexShrink: 0 }}>✦</span> {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              )
            })}
          </div>

          {/* Join CTA */}
          <div style={{ position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden', textAlign: 'center' }}>
            <img src="/images/gifts/voluspa-mercury-glass.jpg"
              alt="Join the Spa Rivier loyalty programme" loading="lazy"
              style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(49,58,77,0.78)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-lg)', padding: 'var(--space-sm)' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem,2.5vw,1.8rem)', fontStyle: 'italic', color: 'var(--lavelle-gold-champagne)' }}>
                {t('gifts.loyalty.tagline')}
              </p>
              <a href="/my-account" className="btn-primary">{t('gifts.loyalty.cta')}</a>
            </div>
          </div>
        </div>
      </section>

      <NewsletterSignup />
    </>
  )
}
