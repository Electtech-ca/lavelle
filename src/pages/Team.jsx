import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Sentences        from '../components/ui/Sentences'
import GoldDivider      from '../components/ui/GoldDivider'
import BookingModal     from '../components/ui/BookingModal'
import TeamSection      from '../components/sections/TeamSection'
import NewsletterSignup from '../components/sections/NewsletterSignup'
import { usePhoto } from '../lib/siteContent'

/* ──────────────────────────────────────────────────────────────
   Meet the Team — the client's full story, "Three Women. One Shared
   Vision.", then Donna's founder profile, then the wider team at work
   ("Personal Care. Friendly Faces."). The founder profile and that
   section, with its photos, moved here from the homepage, which keeps
   the short story ("Family First. Always.") with the photo of the three
   of them smiling together in the boutique.
   ────────────────────────────────────────────────────────────── */

const STORY = ['team.story.p1', 'team.story.p2', 'team.story.p3', 'team.story.p4', 'team.story.p5', 'team.story.p6', 'team.story.p7']

/* The team at work (Donna's own photo is in her profile above) */
const TEAM_PHOTOS = [
  { src: '/images/home/salon-service.jpg', alt: 'team.people.photo.salon', pos: '70% center' },
  { src: '/images/home/spa-treatment.jpg', alt: 'team.people.photo.spa',   pos: 'center 30%' },
]

const eyebrow = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-pink)', marginBottom: 'var(--space-sm)' }
const body    = { fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 'var(--text-body)', color: 'var(--lavelle-charcoal)', lineHeight: 1.9, marginBottom: 'var(--space-lg)' }

export default function Team() {
  const { t } = useTranslation()
  const photo = usePhoto()
  const { hash, key } = useLocation()
  const [modalOpen, setModalOpen] = useState(false)

  // "Our Story" links to /team#story. React Router does not scroll to a
  // #hash, so bring the story up.
  useEffect(() => {
    if (hash !== '#story') return
    const id = setTimeout(() => {
      document.getElementById('story')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
    return () => clearTimeout(id)
  }, [hash, key])

  return (
    <>
      {/* Page hero: the story's title, no photo, so the family photo stays the homepage's */}
      <div style={{ background: 'linear-gradient(135deg, #2E3350 0%, #1a1f3a 100%)', padding: 'calc(72px + var(--space-3xl)) var(--space-xl) var(--space-3xl)', textAlign: 'center' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-md)' }}>✦ {t('nav.team')}</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h1)', fontWeight: 300, color: '#F6F5ED', lineHeight: 1.15, marginBottom: 'var(--space-md)', textWrap: 'balance' }}><Sentences text={t('team.hero.headline')} /></h1>
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '1.1rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.75, maxWidth: '600px', margin: '0 auto' }}>{t('team.hero.sub')}</p>
        </div>
      </div>

      {/* The full story, in a comfortable reading column */}
      <section id="story" style={{ background: 'var(--color-cream)', padding: 'var(--space-3xl) var(--space-xl)', scrollMarginTop: '72px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          {STORY.filter(k => t(k).trim()).map((k, i) => (
            <p key={k} style={i === 0
              ? { ...body, fontFamily: 'var(--font-display)', fontSize: 'clamp(1.15rem, 2vw, 1.35rem)', lineHeight: 1.7, color: 'var(--color-blue)' }
              : body}>
              {t(k)}
            </p>
          ))}
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.3rem, 2.4vw, 1.6rem)', fontStyle: 'italic', fontWeight: 300, color: 'var(--color-blue)', textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
            <span style={{ color: 'var(--color-pink)', fontStyle: 'normal', marginRight: '10px' }} aria-hidden="true">✦</span>
            {t('team.story.closing')}
          </p>
        </div>
      </section>

      <TeamSection />

      {/* The wider team, at work */}
      <section style={{ background: 'var(--color-cream)', padding: 'var(--space-3xl) var(--space-xl)' }}>
        <div className="container">
          <div style={{ maxWidth: '720px', margin: '0 auto var(--space-2xl)' }}>
            <p style={{ ...eyebrow, textAlign: 'center' }}>✦ {t('team.people.eyebrow')}</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 200, color: 'var(--color-blue)', lineHeight: 1.2, marginBottom: 'var(--space-xl)', textAlign: 'center', textWrap: 'balance' }}>
              <Sentences text={t('team.people.headline')} />
            </h2>
            {['team.people.body1', 'team.people.body2', 'team.people.body3'].filter(k => t(k).trim()).map(k => <p key={k} style={body}>{t(k)}</p>)}
          </div>

          {/* Photos keep one size and sit centred, however many there are */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 330px))', justifyContent: 'center', gap: 'var(--space-lg)', maxWidth: '1040px', margin: '0 auto var(--space-2xl)' }}>
            {TEAM_PHOTOS.map(p => (
              <img key={p.src} src={photo(p.src)} alt={t(p.alt)} loading="lazy"
                style={{ width: '100%', aspectRatio: '4 / 5', objectFit: 'cover', objectPosition: p.pos, borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', display: 'block' }} />
            ))}
          </div>

          <div className="cta-center">
            <button className="btn-primary" onClick={() => setModalOpen(true)}>{t('cta.book')}</button>
          </div>
        </div>
      </section>

      <GoldDivider />
      <NewsletterSignup />
      <BookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
