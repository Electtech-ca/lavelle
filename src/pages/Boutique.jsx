import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SectionHeader    from '../components/ui/SectionHeader'
import GoldDivider      from '../components/ui/GoldDivider'
import NewsletterSignup from '../components/sections/NewsletterSignup'
import { boutiqueBrands, clothingTypes, outerwearTypes } from '../data/boutiqueBrands'
import { boutiqueBrandsFrench } from '../data/boutiqueBrandsTranslations'
import { supabase } from '../lib/supabase'

/* ──────────────────────────────────────────────────────────────
   Boutique Rivier — the brands we carry, browsable by clothing type.
   Merchandise is sold in store only, so there are no prices or cart
   here: each brand opens its write-up and a few photos, with the
   boutique's address and phone number.
   ────────────────────────────────────────────────────────────── */

const MAIN_FILTERS = ['all', 'tops', 'bottoms', 'outerwear', 'dresses', 'pjs']
const OUTERWEAR_FILTERS = ['outerwear', ...outerwearTypes]
const isOuterwear = f => OUTERWEAR_FILTERS.includes(f)

function matches(brand, filter) {
  if (filter === 'all') return true
  if (filter === 'outerwear') return brand.types.some(t => outerwearTypes.includes(t))
  return brand.types.includes(filter)
}

const NAVY = '#2E3350'
const PINK = '#E9B0B9'

/* ── Filter chip ── */
function Chip({ active, small, onClick, children }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} style={{
      fontFamily: 'var(--font-body)', fontSize: small ? '0.64rem' : '0.7rem', fontWeight: 600,
      letterSpacing: '0.12em', textTransform: 'uppercase',
      padding: small ? '6px 14px' : '9px 18px', borderRadius: 'var(--radius-full)', cursor: 'pointer',
      border: `1px solid ${active ? NAVY : 'rgba(46,51,80,0.22)'}`,
      background: active ? NAVY : 'transparent', color: active ? '#F6F5ED' : NAVY,
      transition: 'all 0.2s ease', whiteSpace: 'nowrap',
    }}>{children}</button>
  )
}

/* ── Photo, or a typographic panel for brands we have no photos of yet ── */
function BrandVisual({ brand, src, rounded = true }) {
  const radius = rounded ? 'var(--radius-lg) var(--radius-lg) 0 0' : 'var(--radius-lg)'
  if (src) {
    return (
      <div style={{ aspectRatio: '3 / 4', overflow: 'hidden', background: 'var(--lavelle-cream)', borderRadius: radius }}>
        <img src={src} alt={brand.name} loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
      </div>
    )
  }
  return (
    <div style={{
      aspectRatio: '3 / 4', borderRadius: radius, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'var(--space-xl)',
      background: `linear-gradient(160deg, ${NAVY} 0%, #1f2338 100%)`,
    }}>
      <span style={{ color: PINK, fontSize: '1rem', marginBottom: 'var(--space-md)' }}>✦</span>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 300, color: '#F6F5ED', lineHeight: 1.2 }}>{brand.name}</span>
      <span style={{ marginTop: 'var(--space-md)', fontFamily: 'var(--font-body)', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(233,176,185,0.8)' }}>Boutique Rivier</span>
    </div>
  )
}

function TypeTags({ types, t }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {types.map(type => (
        <span key={type} style={{
          fontFamily: 'var(--font-body)', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.1em',
          textTransform: 'uppercase', padding: '3px 9px', borderRadius: 'var(--radius-full)',
          background: 'rgba(233,176,185,0.18)', color: NAVY,
        }}>{t(`boutique.filter.${type}`)}</span>
      ))}
    </div>
  )
}

/* ── Brand tile ── */
function BrandTile({ brand, copy, onOpen, t }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button type="button" onClick={e => onOpen(brand, e.currentTarget)}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      aria-label={t('boutique.brand.explore', { name: brand.name })}
      style={{
        textAlign: 'left', padding: 0, border: 'none', cursor: 'pointer', width: '100%',
        background: 'var(--lavelle-white)', borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        boxShadow: hovered ? 'var(--shadow-hover)' : 'var(--shadow-card)',
        transform: hovered ? 'translateY(-4px)' : 'none', transition: 'all 0.3s ease',
        display: 'flex', flexDirection: 'column',
      }}>
      <BrandVisual brand={brand} src={brand.images[0]} />
      <div style={{ padding: 'var(--space-md) var(--space-md) var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', flex: 1 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)', lineHeight: 1.3 }}>{brand.name}</h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontStyle: 'italic', fontWeight: 300, color: 'var(--lavelle-gray-mid)', lineHeight: 1.5, flex: 1 }}>{copy.tagline}</p>
        <TypeTags types={brand.types} t={t} />
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: NAVY, marginTop: '4px' }}>
          {t('boutique.brand.exploreShort')} →
        </span>
      </div>
    </button>
  )
}

/* ── Brand detail: write-up, photos, where to find it ── */
function BrandModal({ brand, copy, onClose, t }) {
  const [shown, setShown] = useState(0)
  const closeRef = useRef(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = e => { if (e.key === 'Escape') onClose() }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prevOverflow }
  }, [onClose])

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="brand-modal-title"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(15,20,35,0.78)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-md)' }}>
      <div style={{ position: 'relative', background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: '980px', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 40px 120px rgba(0,0,0,0.45)' }}>
        <button ref={closeRef} type="button" onClick={onClose} aria-label={t('boutique.brand.close')}
          style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 2, width: '36px', height: '36px', borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'rgba(46,51,80,0.08)', color: NAVY, fontSize: '1rem' }}>✕</button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: 'var(--space-xl)', padding: 'var(--space-xl)' }}>
          {/* Photos */}
          <div>
            <BrandVisual brand={brand} src={brand.images[shown]} rounded={false} />
            {brand.images.length > 1 && (
              <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                {brand.images.map((src, i) => (
                  <button key={src} type="button" onClick={() => setShown(i)} aria-label={`${brand.name} ${i + 1}`}
                    style={{ width: '64px', aspectRatio: '3 / 4', padding: 0, cursor: 'pointer', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: `2px solid ${i === shown ? NAVY : 'transparent'}`, background: 'none' }}>
                    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Write-up */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase', color: PINK }}>✦ Boutique Rivier</p>
            <h2 id="brand-modal-title" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 300, color: 'var(--lavelle-plum-deep)', lineHeight: 1.2 }}>{brand.name}</h2>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontStyle: 'italic', fontWeight: 300, color: NAVY, lineHeight: 1.5 }}>{copy.tagline}</p>
            {copy.body.map((para, i) => (
              <p key={i} style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 300, color: 'var(--lavelle-charcoal)', lineHeight: 1.8 }}>{para}</p>
            ))}
            <TypeTags types={brand.types} t={t} />
            <div style={{ marginTop: 'var(--space-sm)', background: NAVY, borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(246,245,237,0.85)', lineHeight: 1.7, marginBottom: 'var(--space-md)' }}>{t('boutique.brand.visit')}</p>
              <a href="tel:+12509928084" className="btn-primary" style={{ display: 'inline-flex' }}>{t('boutique.brand.call')}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Boutique() {
  const { t, i18n } = useTranslation()
  const french = i18n.language.startsWith('fr') ? boutiqueBrandsFrench : null
  const [filter, setFilter] = useState('all')
  const [open, setOpen] = useState(null)          // { brand, opener } — opener gets focus back on close

  // Clothing-type tags are edited in Admin ▸ Boutique Brands. Until they load —
  // or if the database is unreachable — the built-in tags are used.
  const [savedTags, setSavedTags] = useState(null)
  useEffect(() => {
    if (!supabase) return
    let alive = true
    supabase.from('boutique_brand_tags').select('slug, types')
      .then(({ data, error }) => {
        if (error) { console.error('[Boutique] brand tags:', error.message); return }
        if (alive && data) setSavedTags(Object.fromEntries(data.map(r => [r.slug, r.types])))
      })
    return () => { alive = false }
  }, [])
  const brands = boutiqueBrands.map(b => {
    const types = savedTags?.[b.slug]
    return types ? { ...b, types: clothingTypes.filter(t => types.includes(t)) } : b
  })

  const copyFor = brand => ({
    tagline: french?.[brand.slug]?.tagline || brand.tagline,
    body: french?.[brand.slug]?.body || brand.body,
  })
  const visible = brands.filter(b => matches(b, filter))
  const closeModal = useCallback(() => { const opener = open?.opener; setOpen(null); opener?.focus() }, [open])

  return (
    <>
      {/* Page hero */}
      <div style={{ position: 'relative', height: '68vh', minHeight: '480px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <img src="/branding/Fashion.svg"
          alt={t('boutique.hero.imageAlt')} loading="eager"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(25,12,4,0.78) 0%, rgba(25,12,4,0.5) 60%, rgba(25,12,4,0.72) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', background: 'linear-gradient(to top, rgba(0,0,0,0.45), transparent)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px', padding: 'calc(72px + var(--space-xl)) var(--space-xl) var(--space-xl)' }}>
          <p className="slide-in-up-1" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--lavelle-gold-champagne)', marginBottom: 'var(--space-md)' }}>✦ {t('boutique.hero.eyebrow')}</p>
          <h1 className="slide-in-up-2" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h1)', fontWeight: 300, color: 'var(--lavelle-white)', lineHeight: 1.15, marginBottom: 'var(--space-md)', textShadow: '0 2px 24px rgba(0,0,0,0.4)' }}>{t('boutique.hero.headline')}</h1>
          <p className="slide-in-up-3" style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '1.1rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.75, marginBottom: 'var(--space-xl)' }}>{t('boutique.hero.sub')}</p>
          <div className="slide-in-up-4" style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/giftware" className="btn-secondary">{t('boutique.hero.cta.gifts')}</a>
            <a href="/giftware#certificates" className="btn-secondary">{t('boutique.hero.cta.certs')}</a>
          </div>
        </div>
      </div>

      {/* Brands */}
      <div style={{ background: 'var(--lavelle-ivory)', padding: 'var(--space-lg) var(--space-xl) var(--space-2xl)', minHeight: '60vh' }}>
        <div className="container">
          <SectionHeader eyebrow={t('boutique.section.eyebrow')} headline={t('boutique.section.headline')} subtext={t('boutique.section.sub')} />

          {/* Clothing-type filter */}
          <div role="group" aria-label={t('boutique.filter.label')} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
            {MAIN_FILTERS.map(f => (
              <Chip key={f} active={f === 'outerwear' ? isOuterwear(filter) : filter === f} onClick={() => setFilter(f)}>
                {t(`boutique.filter.${f}`)}
              </Chip>
            ))}
          </div>
          {isOuterwear(filter) && (
            <div role="group" aria-label={t('boutique.filter.outerwear')} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
              {OUTERWEAR_FILTERS.map(f => (
                <Chip key={f} small active={filter === f} onClick={() => setFilter(f)}>
                  {f === 'outerwear' ? t('boutique.filter.allOuterwear') : t(`boutique.filter.${f}`)}
                </Chip>
              ))}
            </div>
          )}
          <p aria-live="polite" style={{ textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--lavelle-gray-mid)', marginBottom: 'var(--space-xl)' }}>
            {t('boutique.filter.count', { count: visible.length })}
          </p>

          {visible.length ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(250px, 100%), 1fr))', gap: 'var(--space-xl)' }}>
              {visible.map(brand => (
                <BrandTile key={brand.slug} brand={brand} copy={copyFor(brand)} t={t}
                  onOpen={(b, opener) => setOpen({ brand: b, opener })} />
              ))}
            </div>
          ) : (
            <div style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center', padding: 'var(--space-xl)', background: 'var(--lavelle-white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', lineHeight: 1.7 }}>
                {t('boutique.filter.empty', { type: t(`boutique.filter.${filter}`) })}{' '}
                <a href="tel:+12509928084" style={{ color: 'var(--lavelle-plum-soft)' }}>250-992-8084</a>.
              </p>
            </div>
          )}
        </div>
      </div>

      {open && <BrandModal brand={open.brand} copy={copyFor(open.brand)} t={t} onClose={closeModal} />}

      <GoldDivider />
      <NewsletterSignup />
    </>
  )
}
