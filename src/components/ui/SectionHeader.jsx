import useScrollAnimation from '../../hooks/useScrollAnimation'

export default function SectionHeader({ eyebrow, headline, subtext, align = 'center', light = false }) {
  const { ref } = useScrollAnimation()
  return (
    <div ref={ref} style={{ textAlign: align, marginBottom: 'var(--space-2xl)' }}>
      {eyebrow && <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--lavelle-gold-champagne)', marginBottom: 'var(--space-sm)' }}>{eyebrow}</p>}
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 300, color: light ? 'var(--lavelle-white)' : 'var(--lavelle-plum-deep)', lineHeight: 1.2, marginBottom: subtext ? 'var(--space-md)' : 0 }}>{headline}</h2>
      {subtext && <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 'var(--text-body)', color: light ? 'rgba(255,255,255,0.7)' : 'var(--lavelle-gray-mid)', maxWidth: '560px', margin: align === 'center' ? '0 auto' : 0, lineHeight: 1.7 }}>{subtext}</p>}
    </div>
  )
}
