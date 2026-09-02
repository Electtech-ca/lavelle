import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function FAQAccordion({ items }) {
  const [open, setOpen] = useState(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
      {items.map((item, i) => (
        <div key={i} style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-lg) var(--space-xl)', background: open === i ? 'var(--lavelle-plum-mid)' : 'var(--lavelle-plum-deep)', color: 'var(--lavelle-white)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 500, letterSpacing: '0.06em', textAlign: 'left', gap: 'var(--space-md)', cursor: 'pointer', transition: 'background 0.2s ease' }}
          >
            <span>{item.q}</span>
            <ChevronDown size={18} color="var(--lavelle-gold-champagne)" style={{ flexShrink: 0, transform: open === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }} />
          </button>
          {open === i && (
            <div style={{ padding: 'var(--space-xl)', background: 'var(--lavelle-white)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', lineHeight: 1.7 }}>
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
