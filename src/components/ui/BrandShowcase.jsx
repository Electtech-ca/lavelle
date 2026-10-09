import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

/* ──────────────────────────────────────────────────────────────
   Brand tiles and their detail view, shared by the Haircare and
   Skincare pages. Merchandise is sold in store only, so there are no
   prices or cart: a tile opens the brand's write-up and photos, with
   the address and phone number.

   `prefix` picks the page's text: <prefix>.brand.explore, .label,
   .visit, .call and .close. `copy` is the brand's text in the current
   language (name, tagline, body, and for a category that gathers
   several brands, lines); `copy.shortName`, when given, is the name in
   the tile's "Explore … at Spa Rivier" line.
   ────────────────────────────────────────────────────────────── */

const NAVY = '#2E3350'
const PINK = '#E9B0B9'

/* ── Photo, or a typographic panel for a category we have no photos of yet.
   Tiles crop the photo to fill; the detail view shows all of it. ── */
function BrandVisual({ name, src, fit = 'cover', rounded = true }) {
  const radius = rounded ? 'var(--radius-lg) var(--radius-lg) 0 0' : 'var(--radius-lg)'
  if (src) {
    return (
      <div style={{ aspectRatio: '1 / 1', overflow: 'hidden', background: '#ffffff', borderRadius: radius }}>
        <img src={src} alt={name} loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: fit, objectPosition: 'center', display: 'block' }} />
      </div>
    )
  }
  return (
    <div style={{
      aspectRatio: '1 / 1', borderRadius: radius, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'var(--space-xl)',
      background: `linear-gradient(160deg, ${NAVY} 0%, #1f2338 100%)`,
    }}>
      <span style={{ color: PINK, fontSize: '1rem', marginBottom: 'var(--space-md)' }}>✦</span>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 300, color: '#F6F5ED', lineHeight: 1.2 }}>{name}</span>
      <span style={{ marginTop: 'var(--space-md)', fontFamily: 'var(--font-body)', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(233,176,185,0.8)' }}>Spa Rivier</span>
    </div>
  )
}

/* ── The brands inside a category that gathers several ── */
function LineTags({ lines }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {lines.map(line => (
        <span key={line.name} style={{
          fontFamily: 'var(--font-body)', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.1em',
          textTransform: 'uppercase', padding: '3px 9px', borderRadius: 'var(--radius-full)',
          background: 'rgba(233,176,185,0.18)', color: NAVY,
        }}>{line.name}</span>
      ))}
    </div>
  )
}

/* ── Brand tile ── */
export function BrandTile({ brand, copy, onOpen, prefix }) {
  const { t } = useTranslation()
  const [hovered, setHovered] = useState(false)
  const explore = t(`${prefix}.brand.explore`, { name: copy.shortName || copy.name })
  return (
    <button type="button" onClick={e => onOpen(brand, e.currentTarget)}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      aria-label={explore}
      style={{
        textAlign: 'left', padding: 0, border: 'none', cursor: 'pointer', width: '100%',
        background: 'var(--lavelle-white)', borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        boxShadow: hovered ? 'var(--shadow-hover)' : 'var(--shadow-card)',
        transform: hovered ? 'translateY(-4px)' : 'none', transition: 'all 0.3s ease',
        display: 'flex', flexDirection: 'column',
      }}>
      <BrandVisual name={copy.name} src={brand.images[0]} />
      <div style={{ padding: 'var(--space-md) var(--space-md) var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', flex: 1 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)', lineHeight: 1.3 }}>{copy.name}</h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontStyle: 'italic', fontWeight: 300, color: 'var(--lavelle-gray-mid)', lineHeight: 1.5, flex: 1 }}>{copy.tagline}</p>
        {brand.lines && <LineTags lines={brand.lines} />}
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, color: NAVY, lineHeight: 1.4, marginTop: '4px' }}>
          {explore} →
        </span>
      </div>
    </button>
  )
}

/* ── Brand detail: write-up, photos, where to find it ── */
export function BrandModal({ brand, copy, onClose, prefix }) {
  const { t } = useTranslation()
  const [shown, setShown] = useState(0)
  const closeRef = useRef(null)
  const titleId = `${prefix}-modal-title`

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = e => { if (e.key === 'Escape') onClose() }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prevOverflow }
  }, [onClose])

  return (
    <div role="dialog" aria-modal="true" aria-labelledby={titleId}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(15,20,35,0.78)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-md)' }}>
      <div style={{ position: 'relative', background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: '980px', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 40px 120px rgba(0,0,0,0.45)' }}>
        <button ref={closeRef} type="button" onClick={onClose} aria-label={t(`${prefix}.brand.close`)}
          style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 2, width: '36px', height: '36px', borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'rgba(46,51,80,0.08)', color: NAVY, fontSize: '1rem' }}>✕</button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: 'var(--space-xl)', padding: 'var(--space-xl)' }}>
          {/* Photos */}
          <div>
            <BrandVisual name={copy.name} src={brand.images[shown]} fit="contain" rounded={false} />
            {brand.images.length > 1 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                {brand.images.map((src, i) => (
                  <button key={src} type="button" onClick={() => setShown(i)} aria-label={`${copy.name} ${i + 1}`}
                    style={{ width: '64px', aspectRatio: '1 / 1', padding: 0, cursor: 'pointer', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: `2px solid ${i === shown ? NAVY : 'transparent'}`, background: 'none' }}>
                    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Write-up */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase', color: PINK }}>✦ {t(`${prefix}.brand.label`)}</p>
            <h2 id={titleId} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 300, color: 'var(--lavelle-plum-deep)', lineHeight: 1.2 }}>{copy.name}</h2>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontStyle: 'italic', fontWeight: 300, color: NAVY, lineHeight: 1.5 }}>{copy.tagline}</p>
            {copy.body.map((para, i) => (
              <p key={i} style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 300, color: 'var(--lavelle-charcoal)', lineHeight: 1.8 }}>{para}</p>
            ))}
            {brand.lines && (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {brand.lines.map((line, i) => (
                  <li key={line.name} style={{ display: 'flex', gap: '10px', alignItems: 'baseline', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 300, color: 'var(--lavelle-charcoal)', lineHeight: 1.6 }}>
                    <span aria-hidden="true" style={{ color: PINK, fontSize: '0.6rem' }}>✦</span>
                    <span><strong style={{ fontWeight: 600, color: NAVY }}>{line.name}</strong> — {copy.lines[i]}</span>
                  </li>
                ))}
              </ul>
            )}
            <div style={{ marginTop: 'var(--space-sm)', background: NAVY, borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(246,245,237,0.85)', lineHeight: 1.7, marginBottom: 'var(--space-md)' }}>{t(`${prefix}.brand.visit`)}</p>
              <a href="tel:+12509928084" className="btn-primary" style={{ display: 'inline-flex' }}>{t(`${prefix}.brand.call`)}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
