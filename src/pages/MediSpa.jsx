import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import GoldDivider      from '../components/ui/GoldDivider'
import NewsletterSignup from '../components/sections/NewsletterSignup'
import BookingModal     from '../components/ui/BookingModal'
import PricingTable     from '../components/ui/PricingTable'

/* ── Tab banner images ── */
const TAB_IMAGES = {
  0: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1400&h=500&fit=crop&q=85', // OxyGeneo facial
  1: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1400&h=500&fit=crop&q=85',   // clinical peels
  2: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1400&h=500&fit=crop&q=85', // laser
  3: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=1400&h=500&fit=crop&q=85', // micro-needling
  4: 'https://images.unsplash.com/photo-1610992235683-e39abc5e4fa7?w=1400&h=500&fit=crop&q=85', // cosmetic tattooing
  5: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=1400&h=500&fit=crop&q=85', // tattoo removal
  6: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1400&h=500&fit=crop&q=85', // freezpen / cryo
}

/* ── Laser Hair Reduction — SharpLight™ ── */
const laserWomenPricing = [
  { area: 'Upper Lip',           s1: '$60',   s6: '$300',  s8: '$390'  },
  { area: 'Chin',                s1: '$60',   s6: '$300',  s8: '$390'  },
  { area: 'Full Face',           s1: '$120',  s6: '$600',  s8: '$780'  },
  { area: 'Underarms',           s1: '$80',   s6: '$400',  s8: '$520'  },
  { area: 'Half Leg',            s1: '$150',  s6: '$750',  s8: '$975'  },
  { area: 'Full Leg',            s1: '$250',  s6: '$1,250', s8: '$1,625' },
  { area: 'Bikini Line',         s1: '$90',   s6: '$450',  s8: '$585'  },
  { area: 'Brazilian',           s1: '$120',  s6: '$600',  s8: '$780'  },
  { area: 'Full Leg + Brazilian',s1: '$340',  s6: '$1,700', s8: '$2,210' },
  { area: 'Lower Arm',           s1: '$120',  s6: '$600',  s8: '$780'  },
  { area: 'Full Arm',            s1: '$180',  s6: '$900',  s8: '$1,170' },
  { area: 'Stomach',             s1: '$120',  s6: '$600',  s8: '$780'  },
  { area: 'Back (Full)',         s1: '$250',  s6: '$1,250', s8: '$1,625' },
]

const laserMenPricing = [
  { area: 'Beard Line',          s1: '$80',   s6: '$400',  s8: '$520'  },
  { area: 'Neck',                s1: '$80',   s6: '$400',  s8: '$520'  },
  { area: 'Chest',               s1: '$200',  s6: '$1,000', s8: '$1,300' },
  { area: 'Back (Full)',         s1: '$300',  s6: '$1,500', s8: '$1,950' },
  { area: 'Shoulders',           s1: '$150',  s6: '$750',  s8: '$975'  },
  { area: 'Full Leg',            s1: '$300',  s6: '$1,500', s8: '$1,950' },
]

const laserSkinPricing = [
  { treatment: 'Skin Rejuvenation',  price: 'From $120 / session' },
  { treatment: 'Vascular Treatment', price: 'From $150 / session' },
  { treatment: 'Rosacea',            price: 'From $150 / session' },
  { treatment: 'Sun Spots & Age Spots', price: 'From $100 / session' },
]

/* ── Cosmetic Tattooing ── */
const cosmeticTatPricing = [
  { service: 'Microblading — Hair Stroke Eyebrows', price: '$420', description: 'Natural hair-stroke technique for defined, realistic brows.' },
  { service: 'Ombre / Powder Eyebrows', price: '$540', description: 'Soft, powdery finish — ideal for a polished, filled look.' },
  { service: 'Combination Brows', price: '$510', description: 'Hair strokes + ombre shading for depth and definition.' },
  { service: 'Eyeliner — Upper Lash Line', price: '$450', description: 'Subtle to bold definition that frames your eyes perfectly.' },
  { service: 'Eyeliner — Upper & Lower', price: '$780', description: 'Complete eye definition, top and bottom.' },
  { service: 'Lip Blush', price: '$540', description: 'Enhance natural lip colour and shape with a soft, blush finish.' },
  { service: 'Full Lip Colour', price: '$680', description: 'Rich, lasting colour for beautifully defined lips.' },
  { service: 'Colour Refresh / Touch-Up', price: 'From $180', description: 'Recommended every 12–18 months to maintain vibrancy.' },
]

/* ── Micro-Needling ── */
const microNeedlingServices = [
  { name: 'DermaRoller — Face', price: '$510', description: 'Classic micro-needling to stimulate collagen and refine skin texture.' },
  { name: 'DermaRoller — Face + Neck', price: '$590', description: 'Extended treatment for face and neck.' },
  { name: 'Xcellaris Pro — Face', price: '$425', description: 'Advanced radiofrequency micro-needling for tightening and resurfacing.' },
  { name: 'Xcellaris Pro — Face + Neck', price: '$510', description: 'Combined face and neck RF micro-needling.' },
  { name: 'Hair & Scalp Rejuvenation', price: 'Call for pricing', description: 'Stimulates scalp circulation for improved hair density and thickness.' },
]

function TabBanner({ tab, title, sub }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '320px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: 'var(--space-2xl)' }}>
      <img src={TAB_IMAGES[tab]} alt={title} loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(46,51,80,0.85) 0%, rgba(46,51,80,0.4) 55%, transparent 100%)' }} />
      <div style={{ position: 'absolute', top: '50%', left: 'var(--space-2xl)', transform: 'translateY(-50%)', maxWidth: '500px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 200, color: '#F6F5ED', lineHeight: 1.2, marginBottom: 'var(--space-sm)' }}>{title}</h2>
        {sub && <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(246,245,237,0.82)', lineHeight: 1.65, fontWeight: 300 }}>{sub}</p>}
      </div>
    </div>
  )
}

function PriceRow({ label, price }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-md) 0', borderBottom: '1px solid var(--color-cream)' }}>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', color: 'var(--color-blue)', fontWeight: 300 }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-blue)', flexShrink: 0, marginLeft: 'var(--space-md)' }}>{price}</span>
    </div>
  )
}

function ConsultNote({ text }) {
  return (
    <div style={{ padding: 'var(--space-lg)', background: 'var(--color-cream)', borderRadius: 'var(--radius-lg)', marginTop: 'var(--space-xl)', borderLeft: '3px solid var(--color-pink)' }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--color-blue)', lineHeight: 1.8, fontWeight: 300 }}>{text}</p>
    </div>
  )
}

export default function MediSpa() {
  const { t } = useTranslation()
  const [tab, setTab] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)

  const tabs = [
    t('medispa.tabs.oxygeneo'),
    t('medispa.tabs.peels'),
    t('medispa.tabs.laser'),
    t('medispa.tabs.needling'),
    t('medispa.tabs.cosmeticTat'),
    t('medispa.tabs.tattooRemoval'),
    t('medispa.tabs.freezpen'),
  ]

  return (
    <>
      {/* ── Page Hero ── */}
      <div style={{ position: 'relative', height: '70vh', minHeight: '480px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <img
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1920&h=800&fit=crop&q=90"
          alt="Sparivier MediSpa — advanced aesthetic treatments"
          loading="eager"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(46,51,80,0.65)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px', padding: 'calc(72px + var(--space-xl)) var(--space-xl) var(--space-xl)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-md)' }}>
            ✦ {t('medispa.hero.eyebrow')}
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h1)', fontWeight: 200, color: '#F6F5ED', lineHeight: 1.1, marginBottom: 'var(--space-md)', textShadow: '0 2px 20px rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {t('medispa.hero.headline')}
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '1.1rem', color: 'rgba(246,245,237,0.85)', lineHeight: 1.75, marginBottom: 'var(--space-xl)' }}>
            {t('medispa.hero.sub')}
          </p>
          <button className="btn-primary" onClick={() => setModalOpen(true)}>{t('medispa.hero.cta')}</button>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div style={{ background: '#F6F5ED', borderBottom: '1px solid var(--color-cream)', position: 'sticky', top: '72px', zIndex: 100, overflowX: 'auto' }}>
        <div className="container" style={{ display: 'flex' }}>
          {tabs.map((label, i) => (
            <button key={label} onClick={() => setTab(i)} style={{
              fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase', padding: '18px 18px',
              border: 'none', borderBottom: tab === i ? '2px solid #E9B0B9' : '2px solid transparent',
              background: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              color: tab === i ? '#2E3350' : 'rgba(46,51,80,0.50)',
              transition: 'color 0.2s',
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div style={{ background: '#F6F5ED', padding: 'var(--space-2xl) var(--space-xl) var(--space-3xl)', minHeight: '60vh' }}>
        <div className="container">

          {/* ── Tab 0: OxyGeneo ── */}
          {tab === 0 && (
            <>
              <TabBanner tab={0} title="OxyGeneo® Facial Technology"
                sub="The world's first OxyPod technology — oxygenate, exfoliate, and infuse in one transformative treatment." />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-2xl)', alignItems: 'start' }}>
                {/* Pricing */}
                <div>
                  <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-lg)' }}>
                    Treatment Pricing
                  </h3>
                  <PriceRow label="OxyGeneo Facial — 60 min" price="$180" />
                  <PriceRow label="OxyGeneo Skin Analysis & Consultation" price="$120" />
                  <PriceRow label="OxyGeneo + Add-On Booster" price="$210" />
                  <PriceRow label="Package of 3 Sessions" price="$495" />
                  <PriceRow label="Package of 6 Sessions" price="$960" />

                  <div style={{ marginTop: 'var(--space-xl)', padding: 'var(--space-xl)', background: '#F4ECDF', borderRadius: 'var(--radius-xl)' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-md)' }}>
                      What is OxyGeneo?
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--color-blue)', lineHeight: 1.8, fontWeight: 300 }}>
                      OxyGeneo® uses patented OxyPod technology to exfoliate the upper skin layer, restore optimal pH balance, and stimulate skin oxygenation from within. Combined with Tripollar RF energy and ultrasound, it tightens, brightens, and rejuvenates skin in a single session.
                    </p>
                  </div>

                  <button className="btn-primary" style={{ marginTop: 'var(--space-xl)' }} onClick={() => setModalOpen(true)}>
                    Book OxyGeneo Treatment
                  </button>
                </div>

                {/* Visual */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                  <img src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=700&h=420&fit=crop&q=80"
                    alt="OxyGeneo facial treatment" loading="lazy"
                    style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }} />
                  <div style={{ background: '#2E3350', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)' }}>
                    {['Exfoliation & Skin Renewal', 'Oxygenation from Within', 'Deep Hydration Infusion', 'Radiofrequency Tightening', 'Zero Downtime'].map(feat => (
                      <div key={feat} style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(246,245,237,0.08)' }}>
                        <span style={{ color: '#E9B0B9', fontWeight: 700, fontSize: '0.8rem' }}>✦</span>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(246,245,237,0.82)', fontWeight: 300 }}>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Tab 1: Clinical Peels ── */}
          {tab === 1 && (
            <>
              <TabBanner tab={1} title="Clinical Peels"
                sub="Science-backed chemical peels delivering visible, lasting improvements — tailored to every skin type and concern." />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-2xl)', alignItems: 'start' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-lg)' }}>
                    Peel Pricing
                  </h3>
                  <PriceRow label="Single Clinical Peel Session" price="$180" />
                  <PriceRow label="Package of 6 Sessions" price="$900" />
                  <PriceRow label="Consultation & Skin Analysis" price="Complimentary" />

                  <div style={{ marginTop: 'var(--space-xl)', padding: 'var(--space-xl)', background: '#F4ECDF', borderRadius: 'var(--radius-xl)' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-md)' }}>
                      Peel Options
                    </p>
                    {[
                      { name: 'The Perfect Derma Peel', desc: 'All-in-one medical-grade peel. Brightens, tightens, and reduces pigmentation.' },
                      { name: 'Retinol Peel', desc: 'Stimulates cellular renewal. Ideal for fine lines, uneven texture, and dullness.' },
                      { name: 'Brightening Peel', desc: 'Targets hyperpigmentation, melasma, and sun damage with vitamin C complex.' },
                      { name: 'Acne Clear Peel', desc: 'Salicylic-based formula to clear congestion and prevent breakouts.' },
                      { name: 'Sensitive Skin Peel', desc: 'Gentle lactic acid blend — safe for rosacea-prone and reactive skin.' },
                    ].map(p => (
                      <div key={p.name} style={{ marginBottom: 'var(--space-md)', paddingBottom: 'var(--space-md)', borderBottom: '1px solid rgba(46,51,80,0.1)' }}>
                        <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-small)', color: '#2E3350', marginBottom: '4px' }}>{p.name}</p>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(46,51,80,0.65)', lineHeight: 1.6, fontWeight: 300 }}>{p.desc}</p>
                      </div>
                    ))}
                  </div>

                  <ConsultNote text="A complimentary skin consultation is required before your first peel. Results are progressive — a course of 3–6 sessions is recommended for optimal outcomes." />
                  <button className="btn-primary" style={{ marginTop: 'var(--space-xl)' }} onClick={() => setModalOpen(true)}>
                    Book Free Consultation
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                  <img src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=700&h=440&fit=crop&q=80"
                    alt="Clinical peel treatment" loading="lazy"
                    style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }} />
                  <img src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=700&h=300&fit=crop&q=80"
                    alt="MediSpa skincare" loading="lazy"
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }} />
                </div>
              </div>
            </>
          )}

          {/* ── Tab 2: Laser Treatments ── */}
          {tab === 2 && (
            <>
              <TabBanner tab={2} title="SharpLight™ Laser Treatments"
                sub="FDA-cleared laser technology for hair reduction, skin rejuvenation, vascular therapy, and more." />

              {/* Skin Treatments */}
              <div style={{ marginBottom: 'var(--space-2xl)' }}>
                <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-lg)' }}>
                  Skin Treatments
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
                  {laserSkinPricing.map(item => (
                    <div key={item.treatment} style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)', boxShadow: 'var(--shadow-card)', borderTop: '3px solid #E9B0B9' }}>
                      <h4 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-small)', color: '#2E3350', marginBottom: 'var(--space-sm)' }}>{item.treatment}</h4>
                      <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '1rem', color: '#2E3350' }}>{item.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hair Reduction Tables */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: 'var(--space-2xl)', marginBottom: 'var(--space-2xl)' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-lg)' }}>
                    Women's Laser Hair Reduction
                  </h3>
                  <PricingTable
                    headers={[t('salon.laser.col.area'), t('salon.laser.col.s1'), t('salon.laser.col.s6'), t('salon.laser.col.s8')]}
                    rows={laserWomenPricing.map(r => [r.area, r.s1, r.s6, r.s8])}
                  />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-lg)' }}>
                    Men's Laser Hair Reduction
                  </h3>
                  <PricingTable
                    headers={[t('salon.laser.col.area'), t('salon.laser.col.s1'), t('salon.laser.col.s6'), t('salon.laser.col.s8')]}
                    rows={laserMenPricing.map(r => [r.area, r.s1, r.s6, r.s8])}
                  />
                  <div style={{ marginTop: 'var(--space-xl)', background: '#2E3350', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)' }}>
                    {[
                      t('salon.laser.feat1'),
                      t('salon.laser.feat2'),
                      t('salon.laser.feat3'),
                      t('salon.laser.feat4'),
                    ].map(f => (
                      <div key={f} style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(246,245,237,0.08)' }}>
                        <span style={{ color: '#E9B0B9', fontWeight: 700 }}>✓</span>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(246,245,237,0.82)', fontWeight: 300 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <ConsultNote text="A complimentary consultation and patch test is required before your first laser session. Packages never expire and can be shared with a family member." />
              <div style={{ marginTop: 'var(--space-xl)' }}>
                <button className="btn-primary" onClick={() => setModalOpen(true)}>Book Free Consultation</button>
              </div>
            </>
          )}

          {/* ── Tab 3: Micro-Needling ── */}
          {tab === 3 && (
            <>
              <TabBanner tab={3} title="Micro-Needling"
                sub="Stimulate collagen, resurface skin, and restore youthful density — with DermaRoller and Xcellaris Pro technologies." />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-2xl)', alignItems: 'start' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-lg)' }}>
                    Pricing
                  </h3>
                  {microNeedlingServices.map(s => (
                    <div key={s.name} style={{ padding: 'var(--space-md) 0', borderBottom: '1px solid var(--color-cream)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', color: '#2E3350', fontWeight: 400 }}>{s.name}</span>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 600, color: '#2E3350', flexShrink: 0, marginLeft: 'var(--space-md)' }}>{s.price}</span>
                      </div>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(46,51,80,0.60)', lineHeight: 1.6, fontWeight: 300 }}>{s.description}</p>
                    </div>
                  ))}

                  <ConsultNote text="A consultation is included with your first micro-needling treatment. Series of 3 recommended for best results. Topical anaesthetic applied 30 minutes prior — minimal discomfort." />
                  <button className="btn-primary" style={{ marginTop: 'var(--space-xl)' }} onClick={() => setModalOpen(true)}>
                    Book Micro-Needling
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                  <img src="https://images.unsplash.com/photo-1612817288484-6f916006741a?w=700&h=440&fit=crop&q=80"
                    alt="Micro-needling treatment" loading="lazy"
                    style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }} />
                  <div style={{ background: '#F4ECDF', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-md)' }}>
                      Treats
                    </p>
                    {['Fine Lines & Wrinkles', 'Acne Scarring', 'Uneven Skin Texture', 'Enlarged Pores', 'Hair Loss & Scalp Thinning', 'Stretch Marks'].map(t => (
                      <div key={t} style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', padding: '6px 0' }}>
                        <span style={{ color: '#E9B0B9', fontWeight: 700 }}>✦</span>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: '#2E3350', fontWeight: 300 }}>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Tab 4: Cosmetic Tattooing ── */}
          {tab === 4 && (
            <>
              <TabBanner tab={4} title="Cosmetic Tattooing"
                sub="Wake up flawless every day. Expert semi-permanent artistry that enhances your natural beauty." />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-lg)', marginBottom: 'var(--space-2xl)' }}>
                {cosmeticTatPricing.map((c, i) => (
                  <div key={c.service} style={{ background: 'white', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                    {i < 3 && (
                      <div style={{ height: '140px', overflow: 'hidden' }}>
                        <img src={[
                          'https://images.unsplash.com/photo-1610992235683-e39abc5e4fa7?w=500&h=280&fit=crop&q=75',
                          'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=500&h=280&fit=crop&q=75',
                          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=280&fit=crop&q=75',
                        ][i]} alt={c.service} loading="lazy"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <div style={{ padding: 'var(--space-lg)', borderTop: '3px solid #E9B0B9' }}>
                      <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-small)', color: '#2E3350', marginBottom: 'var(--space-sm)' }}>{c.service}</h3>
                      <p style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1.1rem', color: '#2E3350', marginBottom: c.description ? 'var(--space-sm)' : 0 }}>{c.price}</p>
                      {c.description && <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(46,51,80,0.65)', lineHeight: 1.6, fontWeight: 300 }}>{c.description}</p>}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ padding: 'var(--space-xl)', background: '#F4ECDF', borderRadius: 'var(--radius-xl)', marginBottom: 'var(--space-xl)', borderLeft: '3px solid #E9B0B9' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: '#2E3350', lineHeight: 1.8, fontWeight: 300 }}>
                  <strong style={{ fontWeight: 600 }}>Important:</strong> A complimentary consultation is required prior to all cosmetic tattooing appointments. Colour refresh touch-ups are recommended every 12–18 months to maintain vibrant, lasting results.
                </p>
              </div>
              <button className="btn-primary" onClick={() => setModalOpen(true)}>Book a Free Consultation</button>
            </>
          )}

          {/* ── Tab 5: Tattoo Removal ── */}
          {tab === 5 && (
            <>
              <TabBanner tab={5} title="EliminInk™ Tattoo Removal"
                sub="Advanced laser tattoo removal — effective, precise, and safe for all skin types." />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-2xl)', alignItems: 'start' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-lg)' }}>
                    Pricing
                  </h3>
                  <PriceRow label="Tattoo Removal — Per Hour" price="$300 / hr" />
                  <PriceRow label="Consultation & Patch Test" price="Complimentary" />
                  <PriceRow label="Small Tattoo (under 5cm²)" price="From $150" />
                  <PriceRow label="Medium Tattoo (5–25cm²)" price="From $300" />
                  <PriceRow label="Large Tattoo (25cm²+)" price="Call for quote" />

                  <div style={{ marginTop: 'var(--space-xl)', padding: 'var(--space-xl)', background: '#F4ECDF', borderRadius: 'var(--radius-xl)' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-md)' }}>
                      About EliminInk™
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: '#2E3350', lineHeight: 1.8, fontWeight: 300 }}>
                      EliminInk™ uses high-energy laser pulses to break tattoo ink into micro-particles that are naturally absorbed by the body. Suitable for all ink colours and all skin tones. Number of sessions varies by tattoo size, age, and colour saturation — your specialist will provide a full assessment.
                    </p>
                  </div>

                  <ConsultNote text="A complimentary consultation and patch test is required before treatment begins. Sessions are spaced 6–8 weeks apart for optimal healing and results." />
                  <button className="btn-primary" style={{ marginTop: 'var(--space-xl)' }} onClick={() => setModalOpen(true)}>
                    Book Free Consultation
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                  <img src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=700&h=440&fit=crop&q=80"
                    alt="Laser tattoo removal" loading="lazy"
                    style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }} />
                  <div style={{ background: '#2E3350', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)' }}>
                    {['All ink colours treated', 'Safe for all skin tones', 'Minimal scarring risk', 'Topical anaesthetic available', 'Flexible session spacing'].map(f => (
                      <div key={f} style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(246,245,237,0.08)' }}>
                        <span style={{ color: '#E9B0B9', fontWeight: 700 }}>✓</span>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(246,245,237,0.82)', fontWeight: 300 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Tab 6: FreezPen ── */}
          {tab === 6 && (
            <>
              <TabBanner tab={6} title="FreezPen® & CryoProbe XP"
                sub="Precision cryotherapy for the safe, effective removal of benign skin lesions — no surgery, no scarring." />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-2xl)', alignItems: 'start' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-lg)' }}>
                    What It Treats
                  </h3>
                  {[
                    'Skin Tags',
                    'Seborrheic Keratosis',
                    'Age Spots & Sun Spots',
                    'Warts & Verrucas',
                    'Milia',
                    'Cherry Angiomas (Blood Spots)',
                    'Dermatofibromas',
                    'Benign Skin Lesions',
                  ].map(item => (
                    <div key={item} style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--color-cream)' }}>
                      <span style={{ color: '#E9B0B9', fontWeight: 700 }}>✦</span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', color: '#2E3350', fontWeight: 300 }}>{item}</span>
                    </div>
                  ))}

                  <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E9B0B9', marginTop: 'var(--space-2xl)', marginBottom: 'var(--space-lg)' }}>
                    Pricing
                  </h3>
                  <PriceRow label="Consultation & Assessment" price="Complimentary" />
                  <PriceRow label="Single Lesion (small)" price="From $80" />
                  <PriceRow label="Single Lesion (medium)" price="From $120" />
                  <PriceRow label="Multiple Lesions — 15 min" price="From $150" />
                  <PriceRow label="Multiple Lesions — 30 min" price="From $250" />

                  <ConsultNote text="FreezPen® cryotherapy uses medical-grade N₂O to freeze and eliminate benign lesions in seconds. Most treatments require just one session. Healing time is 1–2 weeks." />
                  <button className="btn-primary" style={{ marginTop: 'var(--space-xl)' }} onClick={() => setModalOpen(true)}>
                    Book FreezPen Consultation
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                  <img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=700&h=440&fit=crop&q=80"
                    alt="FreezPen cryotherapy treatment" loading="lazy"
                    style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }} />
                  <div style={{ background: '#F4ECDF', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-md)' }}>
                      Why FreezPen?
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: '#2E3350', lineHeight: 1.8, fontWeight: 300 }}>
                      FreezPen® delivers a precise microjet of Nitrous Oxide (N₂O) at –89°C directly to the lesion, with no damage to surrounding skin. It's fast (seconds per lesion), highly effective (90%+ success rate), and virtually pain-free with no anaesthetic required for most cases.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>

      <GoldDivider />
      <NewsletterSignup />
      <BookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
