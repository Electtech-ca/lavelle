import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import GoldDivider      from '../components/ui/GoldDivider'
import NewsletterSignup from '../components/sections/NewsletterSignup'
import BookingModal     from '../components/ui/BookingModal'
import { brunchItems, afternoonTea, alaCarteItems, privateDining } from '../data/gourmetData'

const TAB_IMAGES = [
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&h=500&fit=crop&q=85',   // brunch
  'https://images.unsplash.com/photo-1596467743701-8a70aa3d7a27?w=1400&h=500&fit=crop&q=85',   // afternoon tea
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&h=500&fit=crop&q=85',   // fine dining
  'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=1400&h=500&fit=crop&q=85',   // private dining room
]

/* Unique food photos per dish */
const BRUNCH_IMGS = [
  'https://images.unsplash.com/photo-1533920379810-6bedac961555?w=600&h=380&fit=crop&q=80',  // avocado toast
  'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&h=380&fit=crop&q=80',  // granola parfait
  'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&h=380&fit=crop&q=80',  // eggs benedict
  'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=600&h=380&fit=crop&q=80',  // crepes
  'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&h=380&fit=crop&q=80',  // charcuterie board
]

const ALACARTE_IMGS = [
  'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=600&h=380&fit=crop&q=80',  // scallops
  'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&h=380&fit=crop&q=80',  // risotto
  'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&h=380&fit=crop&q=80',  // salmon
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=380&fit=crop&q=80',  // salad
  'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=600&h=380&fit=crop&q=80',  // creme brulee
]

const TEA_IMGS = [
  'https://images.unsplash.com/photo-1596467743701-8a70aa3d7a27?w=700&h=440&fit=crop&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&h=440&fit=crop&q=80',
  'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=700&h=440&fit=crop&q=80',
]

function TabBanner({ tab, title, sub }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '340px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: 'var(--space-2xl)' }}>
      <img src={TAB_IMAGES[tab]} alt={title} loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,20,10,0.82) 0%, rgba(10,20,10,0.3) 55%, transparent 100%)' }} />
      <div style={{ position: 'absolute', top: '50%', left: 'var(--space-2xl)', transform: 'translateY(-50%)', maxWidth: '480px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 300, color: 'var(--lavelle-white)', lineHeight: 1.2, marginBottom: 'var(--space-sm)' }}>{title}</h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(255,255,255,0.82)', lineHeight: 1.7 }}>{sub}</p>
      </div>
    </div>
  )
}

function FoodCard({ item, img }) {
  return (
    <div style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-card)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-hover)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)' }}>
      {img && (
        <div style={{ height: '210px', overflow: 'hidden' }}>
          <img src={img} alt={item.name} loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }} />
        </div>
      )}
      <div style={{ padding: 'var(--space-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h3)', fontWeight: 400, color: 'var(--lavelle-plum-deep)', lineHeight: 1.3 }}>{item.name}</h3>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 300, color: 'var(--lavelle-gold-deep)', flexShrink: 0 }}>{item.price}</span>
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', lineHeight: 1.75 }}>{item.description}</p>
      </div>
    </div>
  )
}

export default function GourmetFood() {
  const { t } = useTranslation()
  const [tab, setTab] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)

  const tabs = [
    t('gourmet.tabs.brunch'), t('gourmet.tabs.tea'),
    t('gourmet.tabs.alacarte'), t('gourmet.tabs.private'),
  ]

  return (
    <>
      {/* Page hero */}
      <div style={{ position: 'relative', height: '70vh', minHeight: '480px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&h=1080&fit=crop&q=85"
          alt="Sparivier Gourmet dining" loading="eager"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,18,8,0.65)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '660px', padding: 'calc(72px + var(--space-xl)) var(--space-xl) var(--space-xl)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--lavelle-gold-champagne)', marginBottom: 'var(--space-md)' }}>✦ {t('gourmet.hero.eyebrow')}</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h1)', fontWeight: 300, color: 'var(--lavelle-white)', lineHeight: 1.1, marginBottom: 'var(--space-md)', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>{t('gourmet.hero.headline')}</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '1.1rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.75, marginBottom: 'var(--space-xl)' }}>{t('gourmet.hero.sub')}</p>
          <button className="btn-primary" onClick={() => setModalOpen(true)}>{t('gourmet.hero.cta')}</button>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ background: 'var(--lavelle-white)', borderBottom: '1px solid var(--lavelle-cream)', position: 'sticky', top: '72px', zIndex: 100, overflowX: 'auto' }}>
        <div className="container" style={{ display: 'flex' }}>
          {tabs.map((label, i) => (
            <button key={label} onClick={() => setTab(i)} style={{
              fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 500,
              letterSpacing: '0.08em', textTransform: 'uppercase', padding: '18px 28px',
              border: 'none', borderBottom: tab === i ? '2px solid var(--lavelle-gold-champagne)' : '2px solid transparent',
              background: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              color: tab === i ? 'var(--lavelle-plum-deep)' : 'var(--lavelle-gray-mid)',
              transition: 'color 0.2s',
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--lavelle-ivory)', padding: 'var(--space-2xl) var(--space-xl) var(--space-3xl)', minHeight: '60vh' }}>
        <div className="container">

          {/* ── Brunch ── */}
          {tab === 0 && (
            <>
              <TabBanner tab={0} title={t('gourmet.brunch.title')} sub={t('gourmet.brunch.sub')} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-xl)', marginBottom: 'var(--space-2xl)' }}>
                {brunchItems.map((item, i) => (
                  <FoodCard key={item.id} item={item} img={BRUNCH_IMGS[i % BRUNCH_IMGS.length]} />
                ))}
              </div>
              <div style={{ padding: 'var(--space-xl)', background: 'var(--lavelle-plum-whisper)', borderRadius: 'var(--radius-xl)', display: 'flex', gap: 'var(--space-xl)', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', lineHeight: 1.8 }}>
                  <strong style={{ color: 'var(--lavelle-plum-deep)' }}>{t('gourmet.brunch.hoursLabel')}</strong> {t('gourmet.brunch.hours')}
                </p>
                <button className="btn-primary" onClick={() => setModalOpen(true)}>{t('gourmet.brunch.bookBtn')}</button>
              </div>
            </>
          )}

          {/* ── Afternoon Tea ── */}
          {tab === 1 && (
            <>
              <TabBanner tab={1} title={t('gourmet.tea.title')} sub={t('gourmet.tea.sub')} />
              {/* Hero tea image */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-xl)', marginBottom: 'var(--space-2xl)' }}>
                {afternoonTea.map((item, i) => (
                  <div key={item.id} style={{
                    background: item.id === 3 ? 'linear-gradient(135deg, var(--lavelle-plum-deep) 0%, var(--lavelle-plum-mid) 100%)' : 'var(--lavelle-white)',
                    borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-card)',
                    border: item.id === 3 ? '1px solid rgba(228,62,45,0.3)' : 'none',
                  }}>
                    <div style={{ height: '220px', overflow: 'hidden' }}>
                      <img src={TEA_IMGS[i % TEA_IMGS.length]} alt={item.name} loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: 'var(--space-xl)' }}>
                      {item.id === 3 && <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--lavelle-gold-champagne)', marginBottom: 'var(--space-sm)' }}>{t('gourmet.tea.badge')}</p>}
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, color: item.id === 3 ? 'var(--lavelle-white)' : 'var(--lavelle-plum-deep)', marginBottom: 'var(--space-sm)' }}>{item.name}</h3>
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 300, color: 'var(--lavelle-gold-champagne)', marginBottom: 'var(--space-md)' }}>{item.price}<span style={{ fontSize: '0.85rem' }}> {t('gourmet.tea.perPerson')}</span></p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: item.id === 3 ? 'rgba(255,255,255,0.75)' : 'var(--lavelle-gray-mid)', lineHeight: 1.75, marginBottom: 'var(--space-lg)' }}>{item.description}</p>
                      <button className={item.id === 3 ? 'btn-primary' : 'btn-secondary'} onClick={() => setModalOpen(true)}>{t('gourmet.tea.bookBtn')}</button>
                    </div>
                  </div>
                ))}
              </div>
              {/* Tea ambience strip */}
              <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', height: '220px', position: 'relative' }}>
                <img src="https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=1400&h=440&fit=crop&q=80"
                  alt="Afternoon tea at Sparivier" loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(49,58,77,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1rem,2.5vw,1.8rem)', fontStyle: 'italic', color: 'var(--lavelle-gold-champagne)', textAlign: 'center', padding: 'var(--space-xl)' }}>
                    {t('gourmet.tea.brand')}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* ── À la Carte ── */}
          {tab === 2 && (
            <>
              <TabBanner tab={2} title={t('gourmet.alacarte.title')} sub={t('gourmet.alacarte.sub')} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-xl)', marginBottom: 'var(--space-2xl)' }}>
                {alaCarteItems.map((item, i) => (
                  <FoodCard key={item.id} item={item} img={ALACARTE_IMGS[i % ALACARTE_IMGS.length]} />
                ))}
              </div>
              <div style={{ textAlign: 'center' }}>
                <button className="btn-primary" onClick={() => setModalOpen(true)}>{t('gourmet.alacarte.bookBtn')}</button>
              </div>
            </>
          )}

          {/* ── Private Dining ── */}
          {tab === 3 && (
            <>
              <TabBanner tab={3} title={t('gourmet.private.title')} sub={t('gourmet.private.sub')} />

              {/* Full-width private dining photo */}
              <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: 'var(--space-2xl)', height: '340px' }}>
                <img src="https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=1400&h=680&fit=crop&q=85"
                  alt="Sparivier Private Dining Room" loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-lg)', marginBottom: 'var(--space-2xl)' }}>
                {[
                  { label: t('gourmet.private.stat.capacity'), value: t('gourmet.private.stat.capacityVal', { n: privateDining.capacity }) },
                  { label: t('gourmet.private.stat.minimum'),  value: t('gourmet.private.stat.minimumVal',  { n: privateDining.minGuests }) },
                  { label: t('gourmet.private.stat.starting'), value: t('gourmet.private.stat.startingVal', { n: privateDining.pricePerPerson }) },
                  { label: t('gourmet.private.stat.notice'),   value: t('gourmet.private.stat.noticeVal',   { n: privateDining.advanceHours }) },
                ].map(s => (
                  <div key={s.label} style={{ background: 'var(--lavelle-white)', padding: 'var(--space-xl)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)', textAlign: 'center' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--lavelle-gray-mid)', marginBottom: 'var(--space-sm)' }}>{s.label}</p>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)' }}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* What's included */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}>
                <div style={{ padding: 'var(--space-2xl)', background: 'linear-gradient(135deg, var(--lavelle-plum-deep) 0%, var(--lavelle-plum-mid) 100%)', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(228,62,45,0.25)' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--lavelle-gold-champagne)', marginBottom: 'var(--space-md)' }}>{t('gourmet.private.included')}</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {[t('gourmet.private.feat1'), t('gourmet.private.feat2'), t('gourmet.private.feat3'), t('gourmet.private.feat4'), t('gourmet.private.feat5')].map(item => (
                      <li key={item} style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(255,255,255,0.8)', lineHeight: 2.2, display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                        <span style={{ color: 'var(--lavelle-gold-champagne)', fontSize: '0.55rem', flexShrink: 0 }}>✦</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                  <img src="https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=700&h=360&fit=crop&q=80"
                    alt="Private dining at Sparivier" loading="lazy"
                    style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }} />
                  <div style={{ textAlign: 'center' }}>
                    <button className="btn-primary" onClick={() => setModalOpen(true)}>{t('gourmet.private.bookBtn')}</button>
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
