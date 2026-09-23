import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import GoldDivider      from '../components/ui/GoldDivider'
import NewsletterSignup from '../components/sections/NewsletterSignup'
import BookingModal     from '../components/ui/BookingModal'
import PricingTable     from '../components/ui/PricingTable'
import { medispaFrench } from '../data/medispaTranslations'
import {
  facialPricing, oxygeneoPricing, clinicalFacialPricing, microNeedlingPricing,
  skinRejuvenationPricing, cryotherapyPricing, trilipoPricing,
  laserFacePricing, laserBodyPricing, laserLegPricing, laserSkinPricing,
} from '../data/medispaData'

/* ── Tab banner images — Spa Rivier clinic photography ── */
const TAB_IMAGES = {
  0: { src: '/images/medispa/eminence-strawberry-rhubarb.jpg',      pos: 'center'     }, // facials
  1: { src: '/images/medispa/oxygeneo-treatment.jpg',               pos: 'center 62%' }, // oxygeneo
  2: { src: '/images/medispa/clinical-skincare-range.jpg',          pos: 'center'     }, // clinical facials
  3: { src: '/images/medispa/skin-rejuvenation-before-after.jpg',   pos: 'center 38%' }, // micro-needling
  4: { src: '/images/medispa/led-light-therapy.jpg',                pos: 'center 42%' }, // skin rejuvenation
  5: { src: '/images/medispa/trilipo-body-before-after.jpg',        pos: 'center'     }, // trilipo
  6: { src: '/branding/Body.svg',                                   pos: 'center'     }, // cryotherapy
  7: { src: '/images/medispa/laser-before-after.jpg',               pos: 'center 32%' }, // laser
}

function TabBanner({ tab, title, sub }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '320px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: 'var(--space-2xl)' }}>
      <img src={TAB_IMAGES[tab].src} alt={title} loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: TAB_IMAGES[tab].pos, display: 'block' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(46,51,80,0.85) 0%, rgba(46,51,80,0.4) 55%, transparent 100%)' }} />
      <div style={{ position: 'absolute', top: '50%', left: 'var(--space-2xl)', transform: 'translateY(-50%)', maxWidth: '500px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 200, color: '#F6F5ED', lineHeight: 1.2, marginBottom: 'var(--space-sm)' }}>{title}</h2>
        {sub && <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(246,245,237,0.82)', lineHeight: 1.65, fontWeight: 300 }}>{sub}</p>}
      </div>
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

/* ── Single-session + series-of-8 pricing table ── */
function SeriesTable({ headers, rows, names }) {
  return (
    <PricingTable
      headers={headers}
      rows={rows.map((r, i) => [names?.[i] || r.name, r.single, r.series])}
    />
  )
}

/* ── "Buy 6, get 2 free" badge shown above every series table ── */
function SeriesBadge({ text }) {
  return (
    <div style={{ display: 'inline-block', padding: '8px 16px', background: '#2E3350', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-lg)' }}>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#E9B0B9' }}>✦ {text}</span>
    </div>
  )
}

export default function MediSpa() {
  const { t, i18n } = useTranslation()
  const isFrench = i18n.language.startsWith('fr')
  const french = isFrench ? medispaFrench : null
  const [tab, setTab] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)

  const tabs = [
    t('medispa.tabs.facials'),
    t('medispa.tabs.oxygeneo'),
    t('medispa.tabs.peels'),
    t('medispa.tabs.needling'),
    t('medispa.tabs.skinRejuv'),
    t('medispa.tabs.trilipo'),
    t('medispa.tabs.cryo'),
    t('medispa.tabs.laser'),
  ]

  const seriesHeaders = [t('medispa.series.col.treatment'), t('medispa.series.col.single'), t('medispa.series.col.series')]
  const seriesBadge = t('medispa.series.badge')
  const laserHeaders = [t('salon.laser.col.area'), t('medispa.series.col.single'), t('medispa.series.col.series')]
  const laserHeading = { fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-lg)' }

  return (
    <>
      {/* ── Page Hero ── */}
      <div style={{ position: 'relative', height: '70vh', minHeight: '480px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <img
          src="/branding/Skincare.svg"
          alt="Spa Rivier MediSpa — advanced aesthetic treatments"
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
        <div className="container medispa-tab-container" style={{ display: 'flex' }}>
          {tabs.map((label, i) => (
            <button className="medispa-tab" key={label} onClick={() => setTab(i)} style={{
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
      <div style={{ background: '#F6F5ED', padding: 'var(--space-lg) var(--space-xl) var(--space-lg)', minHeight: '60vh' }}>
        <div className="container">

          {/* ── Tab 0: Facials ── */}
          {tab === 0 && (
            <>
              <TabBanner tab={0} title={french?.banner.facials.title || 'Facials & Skin Health'}
                sub={french?.banner.facials.sub || 'Professional expertise, advanced technology, and results-driven treatments for ageing, pigmentation, redness, acne, and overall skin health.'} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: 'var(--space-2xl)', alignItems: 'start' }}>
                <div>
                  <SeriesBadge text={seriesBadge} />
                  <SeriesTable headers={seriesHeaders} rows={facialPricing} names={french?.facials.names} />
                  <ConsultNote text={french?.facials.note || 'Every facial includes the neck and décolleté. Your skin deserves more than a one-size-fits-all approach — we begin with a consultation to match the treatment to your skin.'} />
                  <div className="cta-center" style={{ marginTop: 'var(--space-xl)' }}>
                    <button className="btn-primary" onClick={() => setModalOpen(true)}>{t('medispa.hero.cta')}</button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                  <img src="/images/medispa/noon-aesthetics-collection.png"
                    alt="Noon Aesthetics professional skincare used in our facials" loading="lazy"
                    style={{ width: '100%', height: '300px', objectFit: 'contain', background: '#F6F5ED', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }} />
                  <div style={{ background: '#2E3350', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)' }}>
                    {(french?.facials.features || ['Neck & décolleté included', 'Personalized skin consultation', 'Medical-grade technology', 'Buy 6 sessions, get 2 free', 'Zero downtime options']).map(feat => (
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

          {/* ── Tab 1: OxyGeneo ── */}
          {tab === 1 && (
            <>
              <TabBanner tab={1} title={french?.banner.oxygeneo.title || 'OxyGeneo® Facial Technology'}
                sub={french?.banner.oxygeneo.sub || "The world's first OxyPod technology — oxygenate, exfoliate, and infuse in one transformative treatment."} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: 'var(--space-2xl)', alignItems: 'start' }}>
                <div>
                  <SeriesBadge text={seriesBadge} />
                  <SeriesTable headers={seriesHeaders} rows={oxygeneoPricing} names={french?.oxygeneo.names} />

                  <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-xl)', background: '#F4ECDF', borderRadius: 'var(--radius-xl)' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-md)' }}>
                      {french?.oxygeneo.what || 'What is OxyGeneo?'}
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--color-blue)', lineHeight: 1.8, fontWeight: 300 }}>
                      {french?.oxygeneo.explanation || 'OxyGeneo® uses patented OxyPod technology to exfoliate the upper skin layer, restore optimal pH balance, and stimulate skin oxygenation from within. Combined with Tripollar RF energy and ultrasound, it tightens, brightens, and rejuvenates skin in a single session.'}
                    </p>
                  </div>

                  <button className="btn-primary" style={{ display: 'flex', margin: 'var(--space-xl) auto 0' }} onClick={() => setModalOpen(true)}>
                    {french?.oxygeneo.book || 'Book OxyGeneo Treatment'}
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                  <img src="/images/medispa/eminence-strawberry-rhubarb.jpg"
                    alt="Eminence Organics facial collection" loading="lazy"
                    style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }} />
                  <div style={{ background: '#2E3350', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)' }}>
                    {(french?.oxygeneo.features || ['Exfoliation & Skin Renewal', 'Oxygenation from Within', 'Deep Hydration Infusion', 'Radiofrequency Tightening', 'Zero Downtime']).map(feat => (
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

          {/* ── Tab 2: Clinical Facials ── */}
          {tab === 2 && (
            <>
              <TabBanner tab={2} title={french?.banner.peels.title || 'Clinical Facials'}
                sub={french?.banner.peels.sub || 'Science-backed clinical treatments delivering visible, lasting improvements — tailored to every skin type and concern.'} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: 'var(--space-2xl)', alignItems: 'start' }}>
                <div>
                  <SeriesBadge text={seriesBadge} />
                  <SeriesTable headers={seriesHeaders} rows={clinicalFacialPricing} names={french?.peels.names} />

                  <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-xl)', background: '#F4ECDF', borderRadius: 'var(--radius-xl)' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-md)' }}>
                      {french?.peels.optionsLabel || 'Treatment Options'}
                    </p>
                    {[
                      { name: 'The Perfect Derma Peel', desc: 'All-in-one medical-grade peel. Brightens, tightens, and reduces pigmentation.' },
                      { name: 'Retinol Peel', desc: 'Stimulates cellular renewal. Ideal for fine lines, uneven texture, and dullness.' },
                      { name: 'Brightening Peel', desc: 'Targets hyperpigmentation, melasma, and sun damage with vitamin C complex.' },
                      { name: 'Acne Clear Peel', desc: 'Salicylic-based formula to clear congestion and prevent breakouts.' },
                      { name: 'Sensitive Skin Peel', desc: 'Gentle lactic acid blend — safe for rosacea-prone and reactive skin.' },
                    ].map((p, index) => {
                      const option = french?.peels.options[index]
                      return (
                      <div key={p.name} style={{ marginBottom: 'var(--space-md)', paddingBottom: 'var(--space-md)', borderBottom: '1px solid rgba(46,51,80,0.1)' }}>
                        <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-small)', color: '#2E3350', marginBottom: '4px' }}>{option?.[0] || p.name}</p>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(46,51,80,0.65)', lineHeight: 1.6, fontWeight: 300 }}>{option?.[1] || p.desc}</p>
                      </div>
                      )
                    })}
                  </div>

                  <ConsultNote text={french?.peels.consult || 'A complimentary skin consultation is required before your first clinical facial. Results are progressive — a series is recommended for optimal outcomes.'} />
                  <div className="cta-center" style={{ marginTop: 'var(--space-xl)' }}>
                    <button className="btn-primary" onClick={() => setModalOpen(true)}>
                      {t('medispa.hero.cta')}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                  <img src="/images/medispa/noon-anti-aging-range.png"
                    alt="Noon Aesthetics anti-ageing clinical range" loading="lazy"
                    style={{ width: '100%', height: '300px', objectFit: 'contain', background: '#F6F5ED', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }} />
                  <img src="/images/medispa/skin-rejuvenation-before-after.jpg"
                    alt="Clinical facial results — before and after" loading="lazy"
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }} />
                </div>
              </div>
            </>
          )}

          {/* ── Tab 3: Micro-Needling ── */}
          {tab === 3 && (
            <>
              <TabBanner tab={3} title={french?.banner.needling.title || 'Micro-Needling'}
                sub={french?.banner.needling.sub || 'Stimulate collagen, resurface skin, and restore youthful density.'} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: 'var(--space-2xl)', alignItems: 'start' }}>
                <div>
                  <SeriesBadge text={seriesBadge} />
                  <SeriesTable headers={seriesHeaders} rows={microNeedlingPricing} names={french?.needling.names} />

                  <ConsultNote text={french?.needling.consult || 'A consultation is included with your first micro-needling treatment. Topical anaesthetic is applied 30 minutes prior — minimal discomfort.'} />
                  <div className="cta-center" style={{ marginTop: 'var(--space-xl)' }}>
                    <button className="btn-primary" onClick={() => setModalOpen(true)}>
                      {t('medispa.hero.cta')}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                  <img src="/images/medispa/micro-needling-before-after.jpg"
                    alt="Micro-needling results — before and after" loading="lazy"
                    style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }} />
                  <div style={{ background: '#F4ECDF', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-md)' }}>
                      {french?.needling.treats || 'Treats'}
                    </p>
                    {(french?.needling.treated || ['Fine Lines & Wrinkles', 'Acne Scarring', 'Uneven Skin Texture', 'Enlarged Pores', 'Hair Loss & Scalp Thinning', 'Stretch Marks']).map(item => (
                      <div key={item} style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', padding: '6px 0' }}>
                        <span style={{ color: '#E9B0B9', fontWeight: 700 }}>✦</span>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: '#2E3350', fontWeight: 300 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Tab 4: Skin Rejuvenation ── */}
          {tab === 4 && (
            <>
              <TabBanner tab={4} title={french?.banner.skinRejuv.title || 'Skin Rejuvenation'}
                sub={french?.banner.skinRejuv.sub || 'Photo facial light therapy that evens tone, softens pigmentation, and restores a healthy glow.'} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: 'var(--space-2xl)', alignItems: 'start' }}>
                <div>
                  <SeriesBadge text={seriesBadge} />
                  <SeriesTable headers={seriesHeaders} rows={skinRejuvenationPricing} names={french?.skinRejuv.names} />

                  <ConsultNote text={french?.skinRejuv.consult || 'A complimentary consultation is required before your first photo facial. Sessions are typically spaced 3–4 weeks apart.'} />
                  <div className="cta-center" style={{ marginTop: 'var(--space-xl)' }}>
                    <button className="btn-primary" onClick={() => setModalOpen(true)}>
                      {t('medispa.hero.cta')}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                  <img src="/images/medispa/skin-rejuvenation-before-after.jpg"
                    alt="Photo facial skin rejuvenation — before and after" loading="lazy"
                    style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }} />
                  <div style={{ background: '#F4ECDF', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-md)' }}>
                      {french?.skinRejuv.treats || 'Treats'}
                    </p>
                    {(french?.skinRejuv.treated || ['Sun Damage & Pigmentation', 'Redness & Rosacea', 'Uneven Skin Tone', 'Visible Capillaries', 'Dull, Tired Skin']).map(item => (
                      <div key={item} style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', padding: '6px 0' }}>
                        <span style={{ color: '#E9B0B9', fontWeight: 700 }}>✦</span>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: '#2E3350', fontWeight: 300 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Tab 5: TriLipo ── */}
          {tab === 5 && (
            <>
              <TabBanner tab={5} title={french?.banner.trilipo.title || 'TriLipo® Body Contouring'}
                sub={french?.banner.trilipo.sub || 'Small changes. Real results. Non-invasive body shaping and skin tightening, session by session.'} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: 'var(--space-2xl)', alignItems: 'start' }}>
                <div>
                  <SeriesBadge text={seriesBadge} />
                  <SeriesTable headers={seriesHeaders} rows={trilipoPricing} names={french?.trilipo.names} />

                  <ConsultNote text={french?.trilipo.consult || 'A complimentary consultation is required before your first TriLipo session. Results build progressively — a series of 8 delivers the most noticeable contouring.'} />
                  <div className="cta-center" style={{ marginTop: 'var(--space-xl)' }}>
                    <button className="btn-primary" onClick={() => setModalOpen(true)}>
                      {t('medispa.hero.cta')}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                  <img src="/images/medispa/trilipo-face-before-after.jpg"
                    alt="TriLipo facial contouring — before and after" loading="lazy"
                    style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }} />
                  <div style={{ background: '#2E3350', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)' }}>
                    {(french?.trilipo.features || ['Non-invasive body shaping', 'Skin tightening & firming', 'Cellulite reduction', 'No downtime', 'Buy 6 sessions, get 2 free']).map(feat => (
                      <div key={feat} style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(246,245,237,0.08)' }}>
                        <span style={{ color: '#E9B0B9', fontWeight: 700 }}>✦</span>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(246,245,237,0.82)', fontWeight: 300 }}>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Tab 6: Cryotherapy ── */}
          {tab === 6 && (
            <>
              <TabBanner tab={6} title={french?.banner.freezpen.title || 'Cryotherapy — FreezPen® & CryoProbe XP'}
                sub={french?.banner.freezpen.sub || 'Precision cryotherapy for the safe, effective removal of benign skin lesions — no surgery, no scarring.'} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: 'var(--space-2xl)', alignItems: 'start' }}>
                <div>
                  <SeriesBadge text={seriesBadge} />
                  <SeriesTable headers={seriesHeaders} rows={cryotherapyPricing} names={french?.freezpen.names} />

                  <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E9B0B9', marginTop: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
                    {french?.freezpen.treats || 'What It Treats'}
                  </h3>
                  {(french?.freezpen.items || [
                    'Skin Tags',
                    'Seborrheic Keratosis',
                    'Age Spots & Sun Spots',
                    'Warts & Verrucas',
                    'Milia',
                    'Cherry Angiomas (Blood Spots)',
                    'Dermatofibromas',
                    'Benign Skin Lesions',
                  ]).map(item => (
                    <div key={item} style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--color-cream)' }}>
                      <span style={{ color: '#E9B0B9', fontWeight: 700 }}>✦</span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-body)', color: '#2E3350', fontWeight: 300 }}>{item}</span>
                    </div>
                  ))}

                  <ConsultNote text={french?.freezpen.explanation || 'FreezPen® cryotherapy uses medical-grade N₂O to freeze and eliminate benign lesions in seconds. Most treatments require just one session. Healing time is 1–2 weeks.'} />
                  <div className="cta-center" style={{ marginTop: 'var(--space-xl)' }}>
                    <button className="btn-primary" onClick={() => setModalOpen(true)}>
                      {t('medispa.hero.cta')}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                  <img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=700&h=440&fit=crop&q=80"
                    alt="FreezPen cryotherapy treatment" loading="lazy"
                    style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }} />
                  <div style={{ background: '#F4ECDF', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-md)' }}>
                      {french?.freezpen.why || 'Why FreezPen?'}
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: '#2E3350', lineHeight: 1.8, fontWeight: 300 }}>
                      {french?.freezpen.whyText || "FreezPen® delivers a precise microjet of Nitrous Oxide (N₂O) at –89°C directly to the lesion, with no damage to surrounding skin. It's fast (seconds per lesion), highly effective, and virtually pain-free with no anaesthetic required for most cases."}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Tab 7: Laser Treatments ── */}
          {tab === 7 && (
            <>
              <TabBanner tab={7} title={french?.banner.laser.title || 'SharpLight™ Laser Treatments'}
                sub={french?.banner.laser.sub || 'FDA-cleared laser technology for hair reduction, skin rejuvenation, vascular therapy, and more.'} />

              {/* Skin Treatments */}
              <div style={{ marginBottom: 'var(--space-2xl)' }}>
                <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-lg)' }}>
                  {french?.laser.skin || 'Skin Treatments'}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
                  {laserSkinPricing.map((item, index) => (
                    <div key={item.treatment} style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)', boxShadow: 'var(--shadow-card)', borderTop: '3px solid #E9B0B9' }}>
                      <h4 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-small)', color: '#2E3350', marginBottom: 'var(--space-sm)' }}>{french?.laser.skinNames[index] || item.treatment}</h4>
                      <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '1rem', color: '#2E3350' }}>{item.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hair Removal Tables */}
              <h3 style={laserHeading}>{french?.laser.hair || 'Laser Hair Removal'}</h3>
              <SeriesBadge text={seriesBadge} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(440px, 100%), 1fr))', gap: 'var(--space-2xl)', marginBottom: 'var(--space-2xl)', alignItems: 'start' }}>
                <div>
                  <h3 style={laserHeading}>{french?.laser.face || 'Face'}</h3>
                  <SeriesTable headers={laserHeaders} rows={laserFacePricing} names={french?.laser.faceNames} />
                  <h3 style={laserHeading}>{french?.laser.legs || 'Bikini & Legs'}</h3>
                  <SeriesTable headers={laserHeaders} rows={laserLegPricing} names={french?.laser.legNames} />
                </div>
                <div>
                  <h3 style={laserHeading}>{french?.laser.body || 'Arms & Body'}</h3>
                  <SeriesTable headers={laserHeaders} rows={laserBodyPricing} names={french?.laser.bodyNames} />
                  <div style={{ background: '#2E3350', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)' }}>
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

              <ConsultNote text={french?.laser.consult || 'A complimentary consultation and patch test is required before your first laser session. Packages never expire and can be shared with a family member.'} />
              <div className="cta-center" style={{ marginTop: 'var(--space-xl)' }}>
                <button className="btn-primary" onClick={() => setModalOpen(true)}>{t('salon.laser.bookBtn')}</button>
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
