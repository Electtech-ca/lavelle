/* Reusable quantity stepper — WCAG 2.1 AA compliant */
export default function QuantitySelector({ value, onChange, min = 1, max = 99, size = 'md', disabled = false }) {
  const s = size === 'sm'
    ? { btn: '28px', font: '0.75rem', input: '40px' }
    : { btn: '36px', font: 'var(--text-small)', input: '52px' }

  const dec = () => { if (value > min) onChange(value - 1) }
  const inc = () => { if (value < max) onChange(value + 1) }

  const btnStyle = (enabled) => ({
    width: s.btn, height: s.btn, borderRadius: '50%',
    border: `1px solid ${enabled ? 'var(--lavelle-plum-soft)' : 'var(--lavelle-cream)'}`,
    background: enabled ? 'var(--lavelle-white)' : 'var(--lavelle-cream)',
    color: enabled ? 'var(--lavelle-plum-deep)' : 'var(--lavelle-gray-mid)',
    cursor: enabled && !disabled ? 'pointer' : 'not-allowed',
    fontFamily: 'var(--font-body)', fontSize: '1.1rem', fontWeight: 400,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.2s ease', flexShrink: 0,
    opacity: disabled ? 0.5 : 1,
  })

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }} role="group" aria-label="Quantity selector">
      <button
        onClick={dec} disabled={disabled || value <= min}
        aria-label="Decrease quantity"
        style={btnStyle(value > min && !disabled)}>
        −
      </button>
      <input
        type="number" value={value} readOnly
        aria-label="Current quantity"
        aria-live="polite"
        style={{
          width: s.input, textAlign: 'center', border: '1px solid var(--lavelle-cream)',
          borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: s.font,
          fontWeight: 600, color: 'var(--lavelle-plum-deep)', background: 'var(--lavelle-ivory)',
          padding: '4px 0', outline: 'none', MozAppearance: 'textfield',
          opacity: disabled ? 0.5 : 1,
        }} />
      <button
        onClick={inc} disabled={disabled || value >= max}
        aria-label="Increase quantity"
        style={btnStyle(value < max && !disabled)}>
        +
      </button>
    </div>
  )
}
