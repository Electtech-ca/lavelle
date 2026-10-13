import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import BookingModal from '../ui/BookingModal'

const PLAN_YOUR_VISIT = 'https://www.google.com/maps/search/?api=1&query=Spa+Rivier+353+Reid+Street+Quesnel+BC'

/* The homepage slides, in the client's order. A slide shows either one of the
   client's heading collages (bgImage) or two photos side by side (photos; the
   left one sits under the text). Phones show one photo: the one marked
   `phone`, else the first. `eyebrow` is optional. Each slide lists its own
   buttons: `to` is a page on the site, `href` opens in a new tab, and
   `book` opens the booking dialog. The first button is the primary one. */
const NAVY  = 'linear-gradient(135deg,#313a4d 0%,#1e2a4a 50%,#0f1830 100%)'
const NIGHT = 'linear-gradient(135deg,#1e2535 0%,#0f1828 40%,#0a1020 100%)'

const SLIDES = [
  { id: 'welcome', bgImage: '/branding/Web%20page.svg', bg: 'linear-gradient(135deg,#1e2535 0%,#313a4d 40%,#1a2030 100%)', overlay: 'rgba(20,25,38,0.52)', eyebrow: true,
    buttons: [{ label: 'hero.welcome.cta', to: '/#experience' }, { label: 'cta.book', book: true }] },
  { id: 'spa', bgImage: '/branding/Spa%20page.svg', bg: NAVY, overlay: 'rgba(15,20,35,0.55)', eyebrow: true,
    buttons: [{ label: 'hero.btn.exploreSpa', to: '/spa' }, { label: 'cta.book', book: true }] },
  { id: 'haircare', bgImage: '/branding/Haircare.svg', bg: NIGHT, overlay: 'rgba(15,20,35,0.55)',
    buttons: [{ label: 'hero.btn.exploreHaircare', to: '/haircare' }] },
  { id: 'salon', photos: [{ src: '/images/salon/maria-nila-heal.jpg' }, { src: '/images/home/salon-service.jpg', pos: '65% center', phone: true }], bg: NAVY, overlay: 'rgba(15,20,35,0.55)',
    buttons: [{ label: 'hero.btn.exploreHaircare', to: '/haircare' }, { label: 'hero.btn.bookSalon', book: true }] },
  { id: 'quesnel', bgImage: '/branding/Fashion.svg', bg: NIGHT, overlay: 'rgba(10,15,28,0.50)', eyebrow: true,
    buttons: [{ label: 'hero.btn.story', to: '/team#story' }, { label: 'hero.btn.visit', href: PLAN_YOUR_VISIT }] },
  { id: 'gift', photos: [{ src: '/images/home/gift-display.jpg' }, { src: '/images/home/gift-certificates.jpg' }], bg: 'linear-gradient(135deg,#2e1a0a 0%,#3e2a0a 40%,#1e1a0a 100%)', overlay: 'rgba(30,16,5,0.52)', eyebrow: true,
    buttons: [{ label: 'hero.btn.gifts', to: '/giftware' }, { label: 'hero.btn.certs', to: '/giftware#certificates' }] },
]

export default function HeroBanner() {
  const { t } = useTranslation()

  const slides = SLIDES.map(s => ({
    ...s,
    eyebrow:  s.eyebrow ? t(`hero.${s.id}.eyebrow`) : null,
    headline: t(`hero.${s.id}.headline`),
    sub:      t(`hero.${s.id}.sub`),
  }))
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const goTo = useCallback((index) => {
    setFading(true)
    setTimeout(() => {
      setCurrent(index)
      setFading(false)
    }, 600)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [current, goTo])

  const slide = slides[current]

  return (
    <>
      <div style={{ position: 'relative', height: '100vh', minHeight: '640px', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>

        {/* Background image layers — crossfade */}
        {slides.map((s, i) => (
          <div key={s.id} style={{
            position: 'absolute', inset: 0,
            backgroundImage: s.bgImage ? `url(${s.bgImage})` : undefined,
            backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#1a2030',
            opacity: i === current ? 1 : 0,
            transition: 'opacity 1.2s ease',
            willChange: 'opacity',
          }}>
            {s.photos && (
              <div className="hero-split">
                {s.photos.map((p, j) => (
                  <div key={p.src} className={(s.photos.some(q => q.phone) ? p.phone : j === 0) ? 'hero-split__phone' : undefined}
                    style={{ backgroundImage: `url(${p.src})`, backgroundPosition: p.pos || 'center' }} />
                ))}
              </div>
            )}
            {/* Fallback gradient behind image */}
            <div style={{ position: 'absolute', inset: 0, background: s.bg, opacity: 0.3 }} />
          </div>
        ))}

        {/* Dark cinematic overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: slide.overlay,
          transition: 'background 1.2s ease',
        }} />

        {/* Bottom vignette */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', zIndex: 1,
          background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)',
        }} />

        {/* Grain texture overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2, opacity: 0.025, pointerEvents: 'none',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        }} />

        {/* Text content */}
        <div className="container" style={{ position: 'relative', zIndex: 3, paddingTop: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2xl)' }}>
          <div style={{ maxWidth: '680px' }}>
            {slide.eyebrow && (
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500,
                letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--lavelle-gold-champagne)',
                marginBottom: 'var(--space-md)',
                opacity: fading ? 0 : 1, transform: fading ? 'translateY(12px)' : 'translateY(0)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
              }}>
                ✦ {slide.eyebrow}
              </p>
            )}
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
              fontWeight: 300, lineHeight: 1.1, color: 'var(--lavelle-white)',
              marginBottom: 'var(--space-lg)', whiteSpace: 'pre-line',
              textShadow: '0 2px 20px rgba(0,0,0,0.3)',
              opacity: fading ? 0 : 1, transform: fading ? 'translateY(16px)' : 'translateY(0)',
              transition: 'opacity 0.6s ease 0.05s, transform 0.6s ease 0.05s',
            }}>
              {slide.headline}
            </h1>
            <p style={{
              fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'rgba(255,255,255,0.85)', lineHeight: 1.75, maxWidth: '540px',
              marginBottom: 'var(--space-2xl)', textShadow: '0 1px 8px rgba(0,0,0,0.25)',
              opacity: fading ? 0 : 1, transform: fading ? 'translateY(12px)' : 'translateY(0)',
              transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s',
            }}>
              {slide.sub}
            </p>
            <div style={{
              display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap',
              opacity: fading ? 0 : 1, transform: fading ? 'translateY(8px)' : 'translateY(0)',
              transition: 'opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s',
            }}>
              {slide.buttons.map((b, i) => {
                const className = i === 0 ? 'btn-primary' : 'btn-secondary'
                if (b.book) return <button key={b.label} className={className} onClick={() => setModalOpen(true)}>{t(b.label)}</button>
                if (b.href) return <a key={b.label} href={b.href} target="_blank" rel="noreferrer" className={className}>{t(b.label)}</a>
                return <Link key={b.label} to={b.to} className={className}>{t(b.label)}</Link>
              })}
            </div>
          </div>

        </div>

        {/* Slide indicators */}
        <div style={{
          position: 'absolute', bottom: 'var(--space-2xl)', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: 'var(--space-sm)', zIndex: 4,
        }}>
          {slides.map((s, i) => (
            <button key={s.id} onClick={() => goTo(i)} aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === current ? '32px' : '8px', height: '8px',
                borderRadius: '4px', border: 'none', cursor: 'pointer',
                background: i === current ? 'var(--lavelle-gold-champagne)' : 'rgba(255,255,255,0.35)',
                transition: 'all 0.4s ease', padding: 0,
              }} />
          ))}
        </div>

        {/* Scroll hint */}
        <div style={{
          position: 'absolute', bottom: 'var(--space-xl)', right: 'var(--space-2xl)', zIndex: 4,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
        }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', writingMode: 'vertical-rl' }}>{t('hero.scroll')}</p>
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.35), transparent)' }} />
        </div>
      </div>

      <BookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
