import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import SectionHeader    from '../components/ui/SectionHeader'
import GiftCard         from '../components/ui/GiftCard'
import GoldDivider      from '../components/ui/GoldDivider'
import NewsletterSignup from '../components/sections/NewsletterSignup'
import BookingModal     from '../components/ui/BookingModal'
import { giftItems }    from '../data/giftsData'
import { promotions, loyaltyTiers } from '../data/promotionsData'

const PROMO_IMAGES = [
  'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&h=360&fit=crop&q=75',
  'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&h=360&fit=crop&q=75',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=360&fit=crop&q=75',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=360&fit=crop&q=75',
  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=360&fit=crop&q=75',
  'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600&h=360&fit=crop&q=75',
  'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&h=360&fit=crop&q=75',
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=360&fit=crop&q=75',
]

const LOYALTY_IMAGES = [
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=700&h=460&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=700&h=460&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=700&h=460&fit=crop&q=80',
]

const categoryMap = {
  'Hampers & Sets':         [1, 8, 20],
  'Lifestyle':              [2, 3, 5, 6, 13, 14, 16, 17, 18, 19],
  'Skincare & Beauty':      [4, 10, 11, 15],
  'Jewellery & Accessories':[7, 9, 12],
}

const GALLERY = [
  'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=800&h=500&fit=crop&q=85',
  'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=500&fit=crop&q=85',
  'https://images.unsplash.com/photo-1602178506541-9e89e06b7f6c?w=800&h=500&fit=crop&q=85',
]

export default function Gifts() {
  const { t } = useTranslation()
  const [category, setCategory] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)

  const CATEGORIES = [
    { key: 'all',       label: t('gifts.cat.all') },
    { key: 'hampers',   label: t('gifts.cat.hampers') },
    { key: 'lifestyle', label: t('gifts.cat.lifestyle') },
    { key: 'skincare',  label: t('gifts.cat.skincare') },
    { key: 'jewellery', label: t('gifts.cat.jewellery') },
  ]

  const categoryKeyMap = {
    hampers:   [1, 8, 20],
    lifestyle: [2, 3, 5, 6, 13, 14, 16, 17, 18, 19],
    skincare:  [4, 10, 11, 15],
    jewellery: [7, 9, 12],
  }

  const visible = category === 'all'
    ? giftItems
    : giftItems.filter(g => (categoryKeyMap[category] || []).includes(g.id))

  return (
    <>
      {/* ── Page hero ── */}
      <div style={{ position: 'relative', height: '68vh', minHeight: '480px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <img
          src="https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=1920&h=1080&fit=crop&q=85"
          alt="Sparivier Gifts & Hampers" loading="eager"
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
          <div className="slide-in-up-4" style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => setModalOpen(true)}>{t('gifts.hero.cta1')}</button>
            <a href="/gift-certificates" className="btn-secondary">{t('gifts.hero.cta2')}</a>
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
      <section style={{ background: 'var(--lavelle-ivory)', padding: 'var(--space-3xl) var(--space-xl)' }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-xl)' }}>
            {visible.map((g, i) => (
              <div key={g.id} className={`slide-in-up-${Math.min(i + 1, 6)}`}>
                <GiftCard gift={g} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* ── Bespoke hamper section ── */}
      <section style={{ background: 'var(--lavelle-blush)', padding: 'var(--space-3xl) var(--space-xl)', overflow: 'hidden' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-3xl)', alignItems: 'center' }}>
          <div>
            <SectionHeader
              eyebrow={t('gifts.bespoke.eyebrow')}
              headline={t('gifts.bespoke.headline')}
              subtext={t('gifts.bespoke.sub')}
            />
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--space-xl) 0' }}>
              {[
                t('gifts.bespoke.feat1'),
                t('gifts.bespoke.feat2'),
                t('gifts.bespoke.feat3'),
                t('gifts.bespoke.feat4'),
              ].map(item => (
                <li key={item} style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', lineHeight: 2.2, display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--lavelle-gold-champagne)', marginTop: '7px', fontSize: '0.45rem', flexShrink: 0 }}>✦</span> {item}
                </li>
              ))}
            </ul>
            <button className="btn-primary" onClick={() => setModalOpen(true)}>{t('gifts.bespoke.cta')}</button>
          </div>

          {/* 3-photo collage */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto', gap: 'var(--space-md)' }}>
            <img src={GALLERY[0]} alt="Sparivier signature gift box" loading="lazy"
              style={{ gridColumn: '1 / -1', width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }} />
            <img src={GALLERY[1]} alt="Champagne and chocolate hamper" loading="lazy"
              style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)' }} />
            <img src={GALLERY[2]} alt="Artisan candle collection" loading="lazy"
              style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)' }} />
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* ── Current Promotions ── */}
      <section style={{ background: 'var(--lavelle-ivory)', padding: 'var(--space-3xl) var(--space-xl)' }}>
        <div className="container">
          <SectionHeader
            eyebrow={t('gifts.promos.eyebrow')}
            headline={t('gifts.promos.headline')}
            subtext={t('gifts.promos.sub')}
            align="center"
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-xl)' }}>
            {promotions.map((promo, i) => (
              <div key={promo.id}
                style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-card)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = 'var(--shadow-hover)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)' }}>
                <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                  <img src={PROMO_IMAGES[i % PROMO_IMAGES.length]} alt={promo.title} loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }} />
                  <div style={{ position: 'absolute', top: 'var(--space-md)', right: 'var(--space-md)', background: 'var(--lavelle-gold-champagne)', color: 'var(--lavelle-plum-deep)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 700 }}>
                    {promo.value}
                  </div>
                </div>
                <div style={{ padding: 'var(--space-xl)' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)', marginBottom: 'var(--space-sm)', lineHeight: 1.3 }}>{promo.title}</h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', lineHeight: 1.75, marginBottom: 'var(--space-md)' }}>{promo.description}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--lavelle-gold-champagne)' }}>{t('gifts.promos.valid')}: {promo.expiry}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* ── Loyalty Programme ── */}
      <section style={{ background: 'var(--lavelle-plum-deep)', padding: 'var(--space-3xl) var(--space-xl)' }}>
        <div className="container">
          <SectionHeader
            eyebrow={t('gifts.loyalty.eyebrow')}
            headline={t('gifts.loyalty.headline')}
            subtext={t('gifts.loyalty.sub')}
            light align="center"
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-xl)', marginBottom: 'var(--space-2xl)' }}>
            {loyaltyTiers.map((tier, i) => (
              <div key={tier.tier} style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: i === 2 ? '1px solid rgba(228,62,45,0.5)' : '1px solid rgba(255,255,255,0.1)', boxShadow: i === 2 ? '0 0 40px rgba(228,62,45,0.12)' : 'none' }}>
                <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                  <img src={LOYALTY_IMAGES[i]} alt={`${tier.tier} tier`} loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(49,58,77,0.6)' }} />
                  <div style={{ position: 'absolute', bottom: 'var(--space-md)', left: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                    <span style={{ fontSize: '1.8rem' }}>{tier.emoji}</span>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--lavelle-gold-champagne)' }}>{tier.tier}</h3>
                  </div>
                </div>
                <div style={{ padding: 'var(--space-xl)', background: i === 2 ? 'rgba(228,62,45,0.08)' : 'rgba(255,255,255,0.05)' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', marginBottom: 'var(--space-lg)' }}>{tier.range}</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {tier.benefits.map(b => (
                      <li key={b} style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(255,255,255,0.82)', lineHeight: 2.1, display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--lavelle-gold-champagne)', marginTop: '7px', fontSize: '0.45rem', flexShrink: 0 }}>✦</span> {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Join CTA */}
          <div style={{ position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden', textAlign: 'center' }}>
            <img src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1400&h=360&fit=crop&q=80"
              alt="Join the Sparivier loyalty programme" loading="lazy"
              style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(49,58,77,0.78)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-lg)', padding: 'var(--space-xl)' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem,2.5vw,1.8rem)', fontStyle: 'italic', color: 'var(--lavelle-gold-champagne)' }}>
                {t('gifts.loyalty.tagline')}
              </p>
              <a href="/my-account" className="btn-primary">{t('gifts.loyalty.cta')}</a>
            </div>
          </div>
        </div>
      </section>

      <NewsletterSignup />
      <BookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
