import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import SectionHeader    from '../components/ui/SectionHeader'
import GiftCard         from '../components/ui/GiftCard'
import GoldDivider      from '../components/ui/GoldDivider'
import NewsletterSignup from '../components/sections/NewsletterSignup'
import GiftCertificateSection from '../components/sections/GiftCertificateSection'
import PromotionFeature from '../components/ui/PromotionFeature'
import { giftItems }    from '../data/giftsData'
import { promotions }   from '../data/promotionsData'
import { promotionTranslations } from '../data/promotionTranslations'

const PROMO_IMAGES = [
  '/images/gifts/voluspa-holiday-set.jpg',
  '/images/gifts/tokyomilk-honey-moon-kit.jpg',
  '/images/gifts/candle-diffuser-kitchen.jpg',
  '/images/gifts/lof-true-vanilla.jpg',
  '/images/gifts/voluspa-mercury-glass.jpg',
  '/images/gifts/voluspa-cherry-gloss.jpg',
  '/images/gifts/candle-diffuser-tray.jpg',
]
// Promotions without a graphic of their own take these photos in turn.
const STOCK_PROMOS = promotions.filter(p => !p.image)

// Line icons for the banner strip under the hero, drawn in currentColor.
const iconProps = {
  width: 56, height: 56, viewBox: '0 0 64 64', fill: 'none', stroke: 'currentColor',
  strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true,
}
const FEATURE_ICONS = {
  flower: (
    <svg {...iconProps}>
      <circle cx="43" cy="26" r="6.5" /><circle cx="37.5" cy="16.5" r="6.5" /><circle cx="26.5" cy="16.5" r="6.5" />
      <circle cx="21" cy="26" r="6.5" /><circle cx="26.5" cy="35.5" r="6.5" /><circle cx="37.5" cy="35.5" r="6.5" />
      <circle cx="32" cy="26" r="4" fill="currentColor" />
      <path d="M32 47v8" />
    </svg>
  ),
  gift: (
    <svg {...iconProps}>
      <path d="M18 22a7 7 0 0 1 14 0M32 22a7 7 0 0 1 14 0" />
      <rect x="10" y="22" width="44" height="8" />
      <rect x="13" y="30" width="38" height="26" />
      <path d="M32 22v34" />
    </svg>
  ),
  store: (
    <svg {...iconProps}>
      <path d="M17 12h30M16 16h32l4 8H12z" />
      <rect x="15" y="24" width="34" height="32" />
      <rect x="28" y="42" width="8" height="14" />
    </svg>
  ),
}

// Line icons for the category boxes, in the same hand as the banner's.
const CATEGORY_ICONS = {
  floral: (
    <svg {...iconProps}>
      <path d="M22 12v10a10 10 0 0 0 20 0V12l-5 6-5-7-5 7z" />
      <path d="M32 32v24M32 52c-8 0-13-6-13-14 8 0 13 6 13 14zM32 46c8 0 13-6 13-14-8 0-13 6-13 14z" />
    </svg>
  ),
  candles: (
    <svg {...iconProps}>
      <path d="M32 7c4 5 6 8.5 6 12a6 6 0 0 1-12 0c0-3.5 2-7 6-12zM32 25v4" />
      <rect x="21" y="29" width="22" height="27" rx="2" />
    </svg>
  ),
  home: (
    <svg {...iconProps}>
      <path d="M28 14v6c-6 3-10 9-10 17 0 8 3 14 6 19h16c3-5 6-11 6-19 0-8-4-14-10-17v-6M25 14h14" />
    </svg>
  ),
  kitchen: (
    <svg {...iconProps}>
      <circle cx="32" cy="16" r="3" />
      <path d="M22 26c0-4 4-7 10-7s10 3 10 7" />
      <path d="M18 28h28c3 4 4 8 4 12 0 9-7 16-18 16s-18-7-18-16c0-4 1-8 4-12z" />
      <path d="M15 46c-5-2-8-8-9-17h4c1 5 3 8 6 9M50 34c5 0 8 3 8 7s-3 7-9 9" />
    </svg>
  ),
  gourmet: (
    <svg {...iconProps}>
      <path d="M18 8h6v10c3 2 5 5 5 9v27a2 2 0 0 1-2 2H15a2 2 0 0 1-2-2V27c0-4 2-7 5-9z" />
      <path d="M13 36h16v10H13" />
      <path d="M38 24h16c0 9-3 15-8 15s-8-6-8-15zM46 39v17M40 56h12" />
    </svg>
  ),
  seasonal: (
    <svg {...iconProps}>
      <path d="M21.7 43.2A16 16 0 1 1 42.3 43.2" />
      {[-140, -105, -70, -35, 0, 35, 70, 105, 140].map(a => (
        <path key={a} d="M32 14q-6-1-9-6 6-1 9 6z" transform={`rotate(${a} 32 30)`} />
      ))}
      <path d="M32 46c-4-4-10-4-10 0s6 4 10 0zM32 46c4-4 10-4 10 0s-6 4-10 0zM30 47l-4 9M34 47l4 9" />
    </svg>
  ),
  plush: (
    <svg {...iconProps}>
      <path d="M17.6 31a7 7 0 1 1 7.4-7.4M46.4 31a7 7 0 1 0-7.4-7.4" />
      <circle cx="32" cy="38" r="16" />
      <ellipse cx="32" cy="45" rx="7" ry="5.5" />
      <ellipse cx="32" cy="42.5" rx="2.2" ry="1.6" fill="currentColor" />
      <path d="M32 44v2.5" />
      <circle cx="26" cy="35" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="38" cy="35" r="1.8" fill="currentColor" stroke="none" />
    </svg>
  ),
  occasion: FEATURE_ICONS.gift,
}

/* The client's categories, in their order, two across. A category with a
   photo shows it in place of its icon. An item can sit in more than one (a
   gift is rarely just one thing); ids are from giftsData.js. */
const CATEGORIES = [
  { key: 'floral',    items: [7], image: '/images/gifts/floral-greenery.jpg' },
  { key: 'candles',   items: [3] },
  { key: 'home',      items: [2, 13, 17], image: '/images/gifts/home-decor.jpg' },
  { key: 'kitchen',   items: [6, 14, 22, 23], image: '/images/gifts/kitchen-entertaining.jpg' },
  { key: 'gourmet',   items: [8, 14, 16, 21, 22, 23], image: '/images/gifts/gourmet-food-beverages.jpg' },
  { key: 'seasonal',  items: [], image: '/images/gifts/seasonal-collections.jpg' },   // awaiting stock
  { key: 'plush',     items: [], image: '/images/gifts/plush-keepsakes.jpg' },        // awaiting stock
  { key: 'occasion',  items: [1, 4, 5, 8, 9, 10, 11, 12, 15, 18, 19, 20, 21], image: '/images/gifts/gifts-every-occasion.jpg' },
]

export default function Giftware() {
  const { t, i18n } = useTranslation()
  const isFrench = i18n.language.startsWith('fr')
  const [category, setCategory] = useState(null)        // null shows every gift
  const resultsRef = useRef(null)

  // React Router does not honour a #hash on navigation, so a link arriving
  // from another page at /giftware#certificates would land at the top.
  useEffect(() => {
    if (window.location.hash !== '#certificates') return
    const id = setTimeout(() => {
      document.getElementById('certificates')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
    return () => clearTimeout(id)
  }, [])

  // The gifts sit below all the boxes, so choosing one brings its gifts up.
  useEffect(() => {
    if (category) resultsRef.current?.scrollIntoView({ block: 'start' })
  }, [category])

  const active = CATEGORIES.find(c => c.key === category)
  const visible = active
    ? giftItems.filter(g => active.items.includes(g.id))
    : giftItems

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
            {t('gifts.hero.eyebrow')}
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
      <div style={{ background: 'var(--lavelle-plum-deep)', padding: 'var(--space-2xl) var(--space-xl)' }}>
        <div className="container gift-features">
          {[
            { icon: FEATURE_ICONS.flower, label: t('gifts.features.curated'),  sub: t('gifts.features.curated.sub') },
            { icon: FEATURE_ICONS.gift,   label: t('gifts.features.occasion'), sub: t('gifts.features.occasion.sub') },
            { icon: FEATURE_ICONS.store,  label: t('gifts.features.downtown'), sub: t('gifts.features.downtown.sub') },
          ].map(f => (
            <div key={f.label} className="slide-in-up">
              <div style={{ color: 'var(--lavelle-gold-champagne)', marginBottom: 'var(--space-md)' }}>{f.icon}</div>
              <div className="gift-features__text">
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--lavelle-white)', marginBottom: 'var(--space-sm)' }}>{f.label}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(255,255,255,0.75)' }}>{f.sub}</p>
              </div>
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

          {/* Category boxes: each filters the gifts below; choosing it again shows them all */}
          <div className="gift-categories">
            {CATEGORIES.map(c => (
              <button key={c.key} type="button" className="gift-category" aria-pressed={category === c.key}
                onClick={() => setCategory(category === c.key ? null : c.key)}>
                <span className="gift-category__icon">
                  {c.image ? <img src={c.image} alt="" loading="lazy" /> : CATEGORY_ICONS[c.key]}
                </span>
                <span className="gift-category__text">
                  <span className="gift-category__name">{t(`gifts.cat.${c.key}`)}</span>
                  <span className="gift-category__sub">{t(`gifts.cat.${c.key}.sub`)}</span>
                </span>
              </button>
            ))}
          </div>

          {active && (
            <div ref={resultsRef} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-md)', paddingBottom: 'var(--space-md)', marginBottom: 'var(--space-xl)', borderBottom: '1px solid rgba(233,176,185,0.5)', scrollMarginTop: 'calc(72px + var(--space-lg))' }}>
              <h3 style={{ fontSize: 'var(--text-h3)', fontWeight: 500, color: 'var(--lavelle-plum-deep)', lineHeight: 1.3 }}>
                {t(`gifts.cat.${active.key}`)}
              </h3>
              <button type="button" onClick={() => setCategory(null)}
                style={{
                  fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500,
                  letterSpacing: '0.1em', textTransform: 'uppercase', padding: '9px 20px',
                  borderRadius: 'var(--radius-full)', border: '1px solid var(--lavelle-cream)',
                  background: 'var(--lavelle-white)', color: 'var(--lavelle-gray-mid)',
                }}>
                {t('gifts.cat.all')}
              </button>
            </div>
          )}

          {visible.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-3xl) var(--space-xl)', background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }}>
              <p style={{ fontSize: '1.8rem', marginBottom: 'var(--space-md)' }} aria-hidden="true">✦</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 300, color: 'var(--lavelle-plum-deep)', marginBottom: 'var(--space-sm)' }}>
                {t('gifts.empty.heading')}
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', lineHeight: 1.75, maxWidth: '420px', margin: '0 auto' }}>
                {t('gifts.empty.sub')} <a href="tel:+12509928084" style={{ color: 'var(--lavelle-plum-soft)', whiteSpace: 'nowrap' }}>250-992-8084</a>.
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

      {/* ── What's Happening at Rivier: promotions, events and features ── */}
      <section style={{ background: 'var(--lavelle-ivory)', padding: 'var(--space-md) var(--space-xl)' }}>
        <div className="container">
          <SectionHeader
            headline={t('gifts.promos.headline')}
            subtext={t('gifts.promos.sub')}
            align="center"
          />
          <div className="promotion-grid" style={{ gap: 'var(--space-xl)' }}>
            {promotions.map(promo => {
              const translation = isFrench ? promotionTranslations[promo.id] : null
              const displayTitle = translation?.[0] || promo.title
              const displayValue = translation?.[1] || promo.value
              const displayExpiry = translation?.[2] || promo.expiry
              const displayDescription = translation?.[3] || promo.description
              if (promo.image) return (
                <PromotionFeature key={promo.id} image={promo.image} title={displayTitle} value={displayValue}
                  description={displayDescription} valid={displayExpiry && `${t('gifts.promos.valid')}: ${displayExpiry}`} />
              )
              return (
              <div key={promo.id}
                style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-card)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = 'var(--shadow-hover)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)' }}>
                <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                  <img src={PROMO_IMAGES[STOCK_PROMOS.indexOf(promo) % PROMO_IMAGES.length]} alt={displayTitle} loading="lazy"
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
      <NewsletterSignup />
    </>
  )
}
