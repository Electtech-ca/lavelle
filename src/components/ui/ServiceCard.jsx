import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ServiceCard({ service, onBook }) {
  const { t } = useTranslation()
  const [hovered, setHovered] = useState(false)
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-lg)', boxShadow: hovered ? 'var(--shadow-hover)' : 'var(--shadow-card)', overflow: 'hidden', transform: hovered ? 'translateY(-4px)' : 'translateY(0)', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column' }}>
      {service.image && (
        <div style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
          <img src={service.image} alt={service.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hovered ? 'scale(1.04)' : 'scale(1)', transition: 'transform 0.5s ease' }} />
        </div>
      )}
      <div style={{ padding: 'var(--space-lg)', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-sm)', gap: 'var(--space-sm)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h3)', fontWeight: 400, color: 'var(--lavelle-plum-deep)', lineHeight: 1.25, flex: 1 }}>{service.name}</h3>
          {service.duration && <span style={{ flexShrink: 0, background: 'var(--lavelle-plum-whisper)', color: 'var(--lavelle-plum-soft)', fontSize: 'var(--text-micro)', fontWeight: 500, padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>{service.duration}</span>}
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', lineHeight: 1.65, flex: 1, marginBottom: 'var(--space-lg)' }}>{service.description}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--lavelle-cream)', paddingTop: 'var(--space-md)' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--lavelle-plum-mid)' }}>{service.price}</span>
          <button className="btn-primary" onClick={() => onBook && onBook(service.name)} style={{ padding: '10px 20px', fontSize: '0.72rem' }}>{t('service.bookNow')}</button>
        </div>
      </div>
    </div>
  )
}
