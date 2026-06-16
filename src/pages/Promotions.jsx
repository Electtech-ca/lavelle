import SectionHeader    from '../components/ui/SectionHeader'
import GoldDivider      from '../components/ui/GoldDivider'
import NewsletterSignup from '../components/sections/NewsletterSignup'
import { promotions, loyaltyTiers } from '../data/promotionsData'

const PROMO_IMAGES = [
  'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&h=360&fit=crop&q=75',  // gift box
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=360&fit=crop&q=75',  // birthday/celebration
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=360&fit=crop&q=75', // friends/refer
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=360&fit=crop&q=75', // wednesday lunch
  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=360&fit=crop&q=75',  // spa bundle
  'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=600&h=360&fit=crop&q=75', // quarterly box
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=360&fit=crop&q=75', // bridal
  'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&h=360&fit=crop&q=75', // monday massage
]

const LOYALTY_IMAGES = [
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=700&h=460&fit=crop&q=80', // champagne / celebration
  'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=700&h=460&fit=crop&q=80', // gold tier gifts
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&h=460&fit=crop&q=80', // diamond spa
]

export default function Promotions() {
  return (
    <>
      {/* Page hero with real photo */}
      <div style={{ position: 'relative', height: '65vh', minHeight: '460px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <img src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1920&h=1080&fit=crop&q=85"
          alt="Sparivier promotions and rewards" loading="eager"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(30,5,55,0.68)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '660px', padding: 'calc(72px + var(--space-xl)) var(--space-xl) var(--space-xl)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--lavelle-gold-champagne)', marginBottom: 'var(--space-md)' }}>✦ Current Offers</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h1)', fontWeight: 300, color: 'var(--lavelle-white)', lineHeight: 1.1, marginBottom: 'var(--space-md)', textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>Promotions & Rewards</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '1.1rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.75 }}>Exclusive offers for our guests, plus our Sparivier Loyalty Programme — because the finest clients deserve the most beautiful rewards.</p>
        </div>
      </div>

      {/* Current Promotions */}
      <section style={{ background: 'var(--lavelle-ivory)', padding: 'var(--space-3xl) var(--space-xl)' }}>
        <div className="container">
          <SectionHeader eyebrow="Current Promotions" headline="Offers Made for You" subtext="Limited-time and ongoing specials across spa, salon, boutique, and dining." align="center" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-xl)' }}>
            {promotions.map((promo, i) => (
              <div key={promo.id} style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-card)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = 'var(--shadow-hover)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)' }}>

                {/* Photo */}
                <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                  <img src={PROMO_IMAGES[i % PROMO_IMAGES.length]} alt={promo.title} loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }} />
                  {/* Value badge */}
                  <div style={{ position: 'absolute', top: 'var(--space-md)', right: 'var(--space-md)', background: 'var(--lavelle-gold-champagne)', color: 'var(--lavelle-plum-deep)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 700 }}>
                    {promo.value}
                  </div>
                </div>

                <div style={{ padding: 'var(--space-xl)' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)', marginBottom: 'var(--space-sm)', lineHeight: 1.3 }}>{promo.title}</h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', lineHeight: 1.75, marginBottom: 'var(--space-md)' }}>{promo.description}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--lavelle-gold-champagne)' }}>Valid: {promo.expiry}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* Loyalty Programme */}
      <section style={{ background: 'var(--lavelle-plum-deep)', padding: 'var(--space-3xl) var(--space-xl)' }}>
        <div className="container">
          <SectionHeader eyebrow="Sparivier Rewards" headline="The Loyalty Programme" subtext="Earn points on every visit. Redeem for services, products, and exclusive experiences." light align="center" />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-xl)', marginBottom: 'var(--space-2xl)' }}>
            {loyaltyTiers.map((tier, i) => (
              <div key={tier.tier} style={{
                borderRadius: 'var(--radius-xl)', overflow: 'hidden',
                border: i === 2 ? '1px solid rgba(228,62,45,0.5)' : '1px solid rgba(255,255,255,0.1)',
                boxShadow: i === 2 ? '0 0 40px rgba(228,62,45,0.12)' : 'none',
              }}>
                {/* Tier photo */}
                <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                  <img src={LOYALTY_IMAGES[i]} alt={`${tier.tier} tier`} loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(49,58,77,0.6)' }} />
                  <div style={{ position: 'absolute', bottom: 'var(--space-md)', left: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                    <span style={{ fontSize: '1.8rem' }}>{tier.emoji}</span>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--lavelle-gold-champagne)' }}>{tier.tier}</h3>
                  </div>
                </div>

                {/* Tier content */}
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

          {/* Join CTA strip */}
          <div style={{ position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden', textAlign: 'center' }}>
            <img src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1400&h=360&fit=crop&q=80"
              alt="Join the Sparivier loyalty programme" loading="lazy"
              style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(49,58,77,0.78)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-lg)', padding: 'var(--space-xl)' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem,2.5vw,1.8rem)', fontStyle: 'italic', color: 'var(--lavelle-gold-champagne)' }}>
                Every visit earns you closer to Diamond.
              </p>
              <a href="/my-account" className="btn-primary">Join the Loyalty Programme</a>
            </div>
          </div>
        </div>
      </section>

      <NewsletterSignup />
    </>
  )
}
