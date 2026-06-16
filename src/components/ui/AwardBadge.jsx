export default function AwardBadge({ year, title, org }) {
  return (
    <div style={{ flexShrink: 0, width: '220px', background: 'var(--lavelle-white)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl) var(--space-lg)', textAlign: 'center', boxShadow: 'var(--shadow-card)', border: '1px solid rgba(228,62,45,0.3)' }}>
      <p style={{ fontFamily: 'var(--font-script)', fontSize: '2rem', color: 'var(--lavelle-gold-champagne)', lineHeight: 1, marginBottom: 'var(--space-xs)' }}>{year}</p>
      <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)', lineHeight: 1.3, marginBottom: 'var(--space-sm)' }}>{title}</h4>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', color: 'var(--lavelle-gray-mid)', letterSpacing: '0.06em' }}>{org}</p>
    </div>
  )
}
