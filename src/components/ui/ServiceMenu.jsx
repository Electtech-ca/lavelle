import PricingTable from './PricingTable'
import { usePhoto } from '../../lib/siteContent'

/* ──────────────────────────────────────────────────────────────
   The pieces of a service menu page, shared by Spa and Salon: the
   sticky tab bar, a photo banner over each tab, Service | Price lists,
   a menu note, and the right-hand panel with the department's own
   description (the client's wording from WEB PRICING.xlsx).
   ────────────────────────────────────────────────────────────── */

/* ── Sticky tab bar under the navbar; `barRef` lets a link to a tab scroll it into place ── */
export function TabBar({ labels, active, onChoose, barRef }) {
  return (
    <div ref={barRef} style={{ background: '#F6F5ED', borderBottom: '1px solid var(--color-cream)', position: 'sticky', top: '72px', zIndex: 100, overflowX: 'auto' }}>
      <div className="container balanced-tab-container" style={{ display: 'flex' }}>
        {labels.map((label, i) => (
          <button className="balanced-tab" key={label} onClick={() => onChoose(i)} aria-pressed={active === i} style={{
            fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase', padding: '18px 18px',
            border: 'none', borderBottom: active === i ? '2px solid #E9B0B9' : '2px solid transparent',
            background: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
            color: active === i ? '#2E3350' : 'rgba(46,51,80,0.50)',
            transition: 'color 0.2s',
          }}>{label}</button>
        ))}
      </div>
    </div>
  )
}

/* ── Tab banner, shared with MediSpa; `pos` places the photo in the crop.
   Photos here and in the side panel can be replaced in the admin. ── */
export function TabBanner({ image, title, sub, pos = 'center' }) {
  const photo = usePhoto()
  return (
    <div style={{ position: 'relative', width: '100%', height: '320px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: 'var(--space-2xl)' }}>
      <img src={photo(image)} alt={title} loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, display: 'block' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(46,51,80,0.85) 0%, rgba(46,51,80,0.4) 55%, transparent 100%)' }} />
      <div style={{ position: 'absolute', top: '50%', left: 'var(--space-2xl)', transform: 'translateY(-50%)', maxWidth: '500px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 200, color: '#F6F5ED', lineHeight: 1.2, marginBottom: 'var(--space-sm)' }}>{title}</h2>
        {sub && <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(246,245,237,0.82)', lineHeight: 1.65, fontWeight: 300 }}>{sub}</p>}
      </div>
    </div>
  )
}

/* ── Right-hand column, as on MediSpa: a photo, then the department's description ── */
export function SidePanel({ image, alt, text }) {
  const photo = usePhoto()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <img src={photo(image)} alt={alt} loading="lazy"
        style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)' }} />
      <div style={{ background: '#2E3350', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)' }}>
        <p style={{ color: '#E9B0B9', fontWeight: 700, fontSize: '0.8rem', marginBottom: 'var(--space-sm)' }}>✦</p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(246,245,237,0.82)', lineHeight: 1.8, fontWeight: 300 }}>{text}</p>
      </div>
    </div>
  )
}

/* ── One category as a Service | Price list, MediSpa-style.
   `translations` is the matching French array/object, indexed like `items`. ── */
export function PriceList({ title, items, translations, headers }) {
  return (
    <div>
      <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-lg)' }}>
        {title}
      </h3>
      <PricingTable
        headers={headers}
        rows={items.map((item, i) => [
          translations?.[i]?.service || item.service,
          translations?.[i]?.price || item.price,
        ])}
      />
    </div>
  )
}

/* ── Pricing disclaimer / menu note ── */
export function MenuNote({ text }) {
  return (
    <div style={{ padding: 'var(--space-lg)', background: 'var(--color-cream)', borderRadius: 'var(--radius-lg)', borderLeft: '3px solid var(--color-pink)', marginTop: 'var(--space-xl)' }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: '#2E3350', lineHeight: 1.8, fontWeight: 300 }}>{text}</p>
    </div>
  )
}
