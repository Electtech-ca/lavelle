/* A promotion with a graphic of its own (promotionsData `image`), such as
   Rivier Royalty. It takes a whole row of the .promotion-grid, with the
   graphic beside the text, stacked on narrow screens (.promotion-feature in
   globals.css). Used by Current Promotions on What's Happening and Giftware. */
export default function PromotionFeature({ image, title, value, description, valid }) {
  return (
    <div className="promotion-feature"
      style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)', borderTop: '3px solid var(--lavelle-gold-champagne)' }}>
      <img src={image.src} alt={title} width={image.width} height={image.height} loading="lazy" />
      <div style={{ padding: 'var(--space-xl)' }}>
        <p style={{ display: 'inline-block', background: 'var(--lavelle-gold-champagne)', color: 'var(--lavelle-plum-deep)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
          {value}
        </p>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)', marginBottom: 'var(--space-sm)', lineHeight: 1.3 }}>
          {title}
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', lineHeight: 1.7, marginBottom: 'var(--space-md)' }}>
          {description}
        </p>
        {valid && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--lavelle-plum-soft)' }}>
            {valid}
          </p>
        )}
      </div>
    </div>
  )
}
