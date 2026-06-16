import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import SectionHeader    from '../components/ui/SectionHeader'
import FAQAccordion     from '../components/ui/FAQAccordion'
import GoldDivider      from '../components/ui/GoldDivider'
import NewsletterSignup from '../components/sections/NewsletterSignup'
import BookingModal     from '../components/ui/BookingModal'
import { spaPackages, massagePricing, organicFacials, clinicalPeels, waxingServices, faqItems } from '../data/spaData'
import { lashBrow, nailBar, makeupBar } from '../data/salonData'

/* ── One unique high-quality image per tab ── */
const TAB_IMAGES = {
  0: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1400&h=500&fit=crop&q=85',
  1: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1400&h=500&fit=crop&q=85',
  2: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1400&h=500&fit=crop&q=85',
  3: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1400&h=500&fit=crop&q=85',
  4: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1400&h=500&fit=crop&q=85',
  5: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=1400&h=500&fit=crop&q=85',
  6: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1400&h=500&fit=crop&q=85',
  7: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1400&h=500&fit=crop&q=85',
  8: 'https://images.unsplash.com/photo-1548695607-9c73430547e4?w=1400&h=500&fit=crop&q=85',
}

/* ── Facial card images ── */
const FACIAL_IMAGES = [
  'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&h=380&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=600&h=380&fit=crop&q=80',
]

/* ── Peel card images ── */
const PEEL_IMAGES = [
  'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&h=220&fit=crop&q=75',
  'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=220&fit=crop&q=75',
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=220&fit=crop&q=75',
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=220&fit=crop&q=75',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=220&fit=crop&q=75',
  'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400&h=220&fit=crop&q=75',
  'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=220&fit=crop&q=75',
  'https://images.unsplash.com/photo-1498843053639-170ff2122f35?w=400&h=220&fit=crop&q=75',
  'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=400&h=220&fit=crop&q=75',
  'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&h=220&fit=crop&q=75',
]

/* ── Massage card images (one per duration) ── */
const MASSAGE_IMAGES = [
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=220&fit=crop&q=75',
  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=220&fit=crop&q=75',
  'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=400&h=220&fit=crop&q=75',
  'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=220&fit=crop&q=75',
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=220&fit=crop&q=75',
]

/* ── Waxing card images (cycled across 14 services) ── */
const WAXING_IMAGES = [
  'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=200&fit=crop&q=75',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=200&fit=crop&q=75',
  'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=200&fit=crop&q=75',
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=200&fit=crop&q=75',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=200&fit=crop&q=75',
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=200&fit=crop&q=75',
  'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400&h=200&fit=crop&q=75',
]

/* ── Lash & Brow card images ── */
const LASH_EXT_IMAGES = [
  'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=400&h=200&fit=crop&q=75',
  'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=200&fit=crop&q=75',
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=200&fit=crop&q=75',
  'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&h=200&fit=crop&q=75',
]
const LASH_GLAZE_IMAGES = [
  'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=400&h=200&fit=crop&q=75',
  'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=200&fit=crop&q=75',
]
const BROW_IMAGES = [
  'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=200&fit=crop&q=75',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=200&fit=crop&q=75',
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=200&fit=crop&q=75',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=200&fit=crop&q=75',
]

/* ── Nail card images ── */
const NAIL_EXT_IMAGES = [
  'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=200&fit=crop&q=75',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=200&fit=crop&q=75',
  'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400&h=200&fit=crop&q=75',
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=200&fit=crop&q=75',
]
const NAIL_MANI_IMAGES = [
  'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=200&fit=crop&q=75',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=200&fit=crop&q=75',
  'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&h=200&fit=crop&q=75',
]
const NAIL_PEDI_IMAGES = [
  'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=200&fit=crop&q=75',
  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=200&fit=crop&q=75',
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=200&fit=crop&q=75',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop&q=75',
]

/* ── Tab banner ── */
function TabBanner({ tab, title, sub }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '340px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: 'var(--space-2xl)' }}>
      <img src={TAB_IMAGES[tab]} alt={title} loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(46,51,80,0.80) 0%, rgba(46,51,80,0.30) 60%, transparent 100%)' }} />
      <div style={{ position: 'absolute', top: '50%', left: 'var(--space-2xl)', transform: 'translateY(-50%)', maxWidth: '480px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 300, color: '#F6F5ED', lineHeight: 1.2, marginBottom: 'var(--space-sm)' }}>{title}</h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>{sub}</p>
      </div>
    </div>
  )
}

/* ── Reusable service card ── */
function ServiceCard({ image, name, price, description, subtitle }) {
  return (
    <div style={{
      background: 'white', borderRadius: 'var(--radius-lg)',
      overflow: 'hidden', boxShadow: 'var(--shadow-card)',
      display: 'flex', flexDirection: 'column',
    }}>
      {image && (
        <div style={{ height: '160px', overflow: 'hidden', flexShrink: 0 }}>
          <img src={image} alt={name} loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }} />
        </div>
      )}
      <div style={{ padding: 'var(--space-lg)', borderLeft: '3px solid #E9B0B9', flex: 1 }}>
        <h3 style={{
          fontFamily: 'var(--font-body)', fontSize: '0.70rem', fontWeight: 700,
          letterSpacing: '0.13em', textTransform: 'uppercase',
          color: '#2E3350', marginBottom: 'var(--space-xs)',
        }}>{name}</h3>
        {subtitle && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 300, color: 'rgba(46,51,80,0.50)', marginBottom: 'var(--space-xs)' }}>{subtitle}</p>
        )}
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '1.05rem', fontWeight: 700,
          color: '#2E3350', marginBottom: description ? 'var(--space-xs)' : 0,
        }}>{price}</p>
        {description && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 300, color: 'rgba(46,51,80,0.65)', lineHeight: 1.65 }}>{description}</p>
        )}
      </div>
    </div>
  )
}

/* ── Section divider for sub-categories within a grid ── */
function SectionDivider({ title }) {
  return (
    <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 'var(--space-md)', margin: 'var(--space-xl) 0 var(--space-sm)' }}>
      <div style={{ width: '3px', height: '20px', background: '#E9B0B9', borderRadius: '2px', flexShrink: 0 }} />
      <h3 style={{
        fontFamily: 'var(--font-body)', fontSize: '0.70rem', fontWeight: 700,
        letterSpacing: '0.18em', textTransform: 'uppercase', color: '#2E3350',
        whiteSpace: 'nowrap',
      }}>{title}</h3>
      <div style={{ flex: 1, height: '1px', background: 'rgba(46,51,80,0.10)' }} />
    </div>
  )
}

export default function Spa() {
  const { t } = useTranslation()
  const [tab, setTab] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)

  const tabs = [
    t('spa.tabs.packages'), t('spa.tabs.massage'), t('spa.tabs.facials'),
    t('spa.tabs.peels'), t('spa.tabs.waxing'),
    t('salon.tabs.lashBrow'), t('salon.tabs.nailBar'), t('salon.tabs.makeupBar'),
    t('spa.tabs.faq'),
  ]

  const GRID_SM = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 'var(--space-lg)' }
  const GRID_MD = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-lg)' }

  return (
    <>
      {/* Page hero */}
      <div style={{ position: 'relative', height: '70vh', minHeight: '480px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <img src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1920&h=1080&fit=crop&q=90"
          alt="Sparivier Spa — serene luxury treatment room" loading="eager"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,25,38,0.62)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '660px', padding: 'calc(72px + var(--space-xl)) var(--space-xl) var(--space-xl)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-md)' }}>✦ {t('spa.hero.eyebrow')}</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h1)', fontWeight: 300, color: '#F6F5ED', lineHeight: 1.1, marginBottom: 'var(--space-md)', textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>{t('spa.hero.headline')}</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '1.1rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.75, marginBottom: 'var(--space-xl)' }}>{t('spa.hero.sub')}</p>
          <button className="btn-primary" onClick={() => setModalOpen(true)}>{t('spa.hero.cta')}</button>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ background: '#F6F5ED', borderBottom: '1px solid #F4ECDF', position: 'sticky', top: '72px', zIndex: 100, overflowX: 'auto' }}>
        <div className="container" style={{ display: 'flex' }}>
          {tabs.map((label, i) => (
            <button key={label} onClick={() => setTab(i)} style={{
              fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 500,
              letterSpacing: '0.08em', textTransform: 'uppercase', padding: '18px 24px',
              border: 'none', borderBottom: tab === i ? '2px solid #E9B0B9' : '2px solid transparent',
              background: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              color: tab === i ? '#2E3350' : 'rgba(46,51,80,0.50)',
              transition: 'color 0.2s',
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div style={{ background: '#F4ECDF', padding: 'var(--space-2xl) var(--space-xl) var(--space-3xl)', minHeight: '60vh' }}>
        <div className="container">

          {/* ── Packages ── */}
          {tab === 0 && (
            <>
              <TabBanner tab={0} title={t('spa.packages.title')} sub={t('spa.packages.sub')} />
              <div style={{ ...GRID_MD }}>
                {spaPackages.map(p => (
                  <div key={p.id} style={{ background: 'white', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                    <div style={{ height: '200px', overflow: 'hidden' }}>
                      <img src={p.image} alt={p.name} loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)' }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }} />
                    </div>
                    <div style={{ padding: 'var(--space-xl)', borderLeft: '3px solid #E9B0B9' }}>
                      <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: '#2E3350', marginBottom: 'var(--space-xs)' }}>{p.name}</h3>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.25rem', fontWeight: 700, color: '#2E3350', marginBottom: 'var(--space-sm)' }}>{p.price}</p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(46,51,80,0.65)', lineHeight: 1.7, marginBottom: 'var(--space-lg)' }}>{p.description}</p>
                      <button className="btn-primary" style={{ width: '100%', fontSize: '0.72rem', padding: '12px' }} onClick={() => setModalOpen(true)}>{t('spa.packages.bookBtn')}</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── Massage ── */}
          {tab === 1 && (
            <>
              <TabBanner tab={1} title={t('spa.massage.title')} sub={t('spa.massage.sub')} />
              <div style={{ ...GRID_SM, marginBottom: 'var(--space-xl)' }}>
                {massagePricing.map((m, i) => (
                  <ServiceCard key={m.duration}
                    image={MASSAGE_IMAGES[i % MASSAGE_IMAGES.length]}
                    name={m.duration}
                    price={m.price}
                  />
                ))}
              </div>
              <div style={{ background: 'rgba(46,51,80,0.05)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg) var(--space-xl)', borderLeft: '3px solid #E9B0B9', marginBottom: 'var(--space-xl)' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 600, color: '#2E3350', marginBottom: 'var(--space-xs)' }}>{t('spa.massage.addonsTitle')}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 300, color: 'rgba(46,51,80,0.65)', lineHeight: 1.8 }}>{t('spa.massage.addonsList')}</p>
              </div>
              <button className="btn-primary" onClick={() => setModalOpen(true)}>{t('spa.massage.bookBtn')}</button>
            </>
          )}

          {/* ── Organic Facials ── */}
          {tab === 2 && (
            <>
              <TabBanner tab={2} title={t('spa.facials.title')} sub={t('spa.facials.sub')} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-xl)', marginBottom: 'var(--space-3xl)' }}>
                {organicFacials.map((f, i) => (
                  <div key={f.id} style={{ background: 'white', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                    <div style={{ height: '260px', overflow: 'hidden' }}>
                      <img src={FACIAL_IMAGES[i % FACIAL_IMAGES.length]} alt={f.name} loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                    </div>
                    <div style={{ padding: 'var(--space-xl)', borderLeft: '3px solid #E9B0B9' }}>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-sm)' }}>{t('spa.facials.badge')}</p>
                      <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '0.80rem', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#2E3350', marginBottom: 'var(--space-xs)' }}>{f.name}</h3>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.4rem', fontWeight: 700, color: '#2E3350', marginBottom: 'var(--space-md)' }}>{f.price}</p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 300, color: 'rgba(46,51,80,0.65)', lineHeight: 1.75 }}>{f.description}</p>
                      <button className="btn-primary" style={{ marginTop: 'var(--space-lg)', width: '100%', fontSize: '0.72rem', padding: '12px' }} onClick={() => setModalOpen(true)}>{t('spa.facials.bookBtn')}</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', position: 'relative', height: '200px' }}>
                <img src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1400&h=400&fit=crop&q=80"
                  alt="Eminence Organic skincare products" loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(46,51,80,0.70)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem,3vw,2rem)', fontStyle: 'italic', color: '#E9B0B9', textAlign: 'center', padding: 'var(--space-xl)' }}>
                    {t('spa.facials.brand')}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* ── Clinical Peels ── */}
          {tab === 3 && (
            <>
              <TabBanner tab={3} title={t('spa.peels.title')} sub={t('spa.peels.sub')} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-lg)', marginBottom: 'var(--space-2xl)' }}>
                {clinicalPeels.map((p, i) => (
                  <div key={p.name} style={{ background: 'white', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                    <div style={{ height: '160px', overflow: 'hidden' }}>
                      <img src={PEEL_IMAGES[i % PEEL_IMAGES.length]} alt={p.name} loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)' }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }} />
                    </div>
                    <div style={{ padding: 'var(--space-lg)', borderLeft: '3px solid #E9B0B9' }}>
                      <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '0.70rem', fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: '#2E3350', marginBottom: 'var(--space-sm)' }}>{p.name}</h3>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 300, color: 'rgba(46,51,80,0.65)', lineHeight: 1.7 }}>{p.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: 'center' }}>
                <button className="btn-primary" onClick={() => setModalOpen(true)}>{t('spa.peels.bookBtn')}</button>
              </div>
            </>
          )}

          {/* ── Waxing ── */}
          {tab === 4 && (
            <>
              <TabBanner tab={4} title={t('spa.waxing.title')} sub={t('spa.waxing.sub')} />
              <div style={{ ...GRID_SM, marginBottom: 'var(--space-xl)' }}>
                {waxingServices.map((w, i) => (
                  <ServiceCard key={w.service}
                    image={WAXING_IMAGES[i % WAXING_IMAGES.length]}
                    name={w.service}
                    price={w.price}
                  />
                ))}
              </div>
              <button className="btn-primary" onClick={() => setModalOpen(true)}>{t('spa.waxing.bookBtn')}</button>
            </>
          )}

          {/* ── Lash & Brow ── */}
          {tab === 5 && (
            <>
              <TabBanner tab={5} title={t('salon.lash.title')} sub={t('salon.lash.sub')} />
              <div style={{ ...GRID_SM, marginBottom: 'var(--space-xl)' }}>
                <SectionDivider title={t('salon.lash.lashTitle')} />
                {lashBrow.lashExtensions.map((item, i) => (
                  <ServiceCard key={item.service}
                    image={LASH_EXT_IMAGES[i % LASH_EXT_IMAGES.length]}
                    name={item.service}
                    price={item.price}
                  />
                ))}
                <SectionDivider title={t('salon.lash.glazeTitle')} />
                {lashBrow.glaze.map((item, i) => (
                  <ServiceCard key={item.service}
                    image={LASH_GLAZE_IMAGES[i % LASH_GLAZE_IMAGES.length]}
                    name={item.service}
                    price={item.price}
                  />
                ))}
                <SectionDivider title={t('salon.lash.browTitle')} />
                {lashBrow.brows.map((item, i) => (
                  <ServiceCard key={item.service}
                    image={BROW_IMAGES[i % BROW_IMAGES.length]}
                    name={item.service}
                    price={item.price}
                  />
                ))}
              </div>
              <button className="btn-primary" onClick={() => setModalOpen(true)}>{t('salon.lash.bookBtn')}</button>
            </>
          )}

          {/* ── Nail Bar ── */}
          {tab === 6 && (
            <>
              <TabBanner tab={6} title={t('salon.nails.title')} sub={t('salon.nails.sub')} />
              <div style={{ ...GRID_SM, marginBottom: 'var(--space-xl)' }}>
                <SectionDivider title={t('salon.nails.extensionsTitle')} />
                {nailBar.extensions.map((item, i) => (
                  <ServiceCard key={item.service}
                    image={NAIL_EXT_IMAGES[i % NAIL_EXT_IMAGES.length]}
                    name={item.service}
                    price={item.price}
                  />
                ))}
                <SectionDivider title={t('salon.nails.maniTitle')} />
                {nailBar.hand.map((item, i) => (
                  <ServiceCard key={item.service}
                    image={NAIL_MANI_IMAGES[i % NAIL_MANI_IMAGES.length]}
                    name={item.service}
                    price={item.price}
                  />
                ))}
                <SectionDivider title={t('salon.nails.pediTitle')} />
                {nailBar.foot.map((item, i) => (
                  <ServiceCard key={item.service}
                    image={NAIL_PEDI_IMAGES[i % NAIL_PEDI_IMAGES.length]}
                    name={item.service}
                    price={item.price}
                  />
                ))}
              </div>
              <button className="btn-primary" onClick={() => setModalOpen(true)}>{t('salon.nails.bookBtn')}</button>
            </>
          )}

          {/* ── Makeup Bar ── */}
          {tab === 7 && (
            <>
              <TabBanner tab={7} title={t('salon.makeup.title')} sub={t('salon.makeup.sub')} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-lg)', marginBottom: 'var(--space-2xl)' }}>
                {makeupBar.map((m, i) => {
                  const makeupImgs = [
                    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=200&fit=crop&q=75',
                    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=200&fit=crop&q=75',
                    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=200&fit=crop&q=75',
                    'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400&h=200&fit=crop&q=75',
                  ]
                  return (
                    <ServiceCard key={m.service}
                      image={makeupImgs[i % makeupImgs.length]}
                      name={m.service}
                      subtitle={m.duration}
                      price={m.price}
                    />
                  )
                })}
              </div>
              <button className="btn-primary" onClick={() => setModalOpen(true)}>{t('salon.makeup.bookBtn')}</button>
            </>
          )}

          {/* ── FAQ ── */}
          {tab === 8 && (
            <>
              <TabBanner tab={8} title={t('spa.faq.title')} sub={t('spa.faq.sub')} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-2xl)', alignItems: 'start' }}>
                <div style={{ maxWidth: '720px' }}>
                  <FAQAccordion items={faqItems} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                  <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=360&fit=crop&q=80"
                    alt="Sparivier Spa sanctuary" loading="lazy"
                    style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }} />
                  <div style={{ background: '#2E3350', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)' }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontStyle: 'italic', color: '#E9B0B9', marginBottom: 'var(--space-md)' }}>{t('spa.faq.readyTitle')}</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(246,245,237,0.75)', lineHeight: 1.7, marginBottom: 'var(--space-lg)' }}>{t('spa.faq.readySub1')} <a href="tel:+12509928084" style={{ color: '#E9B0B9' }}>250-992-8084</a> {t('spa.faq.readySub2')}</p>
                    <button className="btn-primary" onClick={() => setModalOpen(true)}>{t('spa.faq.bookBtn')}</button>
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
