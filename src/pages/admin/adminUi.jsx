import { X } from 'lucide-react'

/* ──────────────────────────────────────────────────────────────
   Styles and small pieces the newer admin pages share, matching the
   look of Services, Promotions and Boutique Brands.
   ────────────────────────────────────────────────────────────── */

export const NAVY = '#2E3350'

export const inputStyle = err => ({
  width: '100%', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', padding: '10px 14px',
  border: `1px solid ${err ? '#C0392B' : 'var(--lavelle-cream)'}`, borderRadius: 'var(--radius-md)',
  outline: 'none', background: 'var(--lavelle-ivory)', color: 'var(--lavelle-charcoal)', boxSizing: 'border-box',
})
export const textareaStyle = err => ({ ...inputStyle(err), resize: 'vertical', lineHeight: 1.6 })
export const labelStyle = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--lavelle-plum-deep)', display: 'block', marginBottom: '6px' }
export const hintStyle  = { fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--lavelle-gray-mid)', marginTop: '4px', lineHeight: 1.5 }
export const errStyle   = { fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: '#C0392B', marginTop: '4px' }
export const groupTitle = { fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)', borderBottom: '1px solid var(--lavelle-cream)', paddingBottom: 'var(--space-xs)' }
export const card       = { background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)', padding: 'var(--space-lg)' }
export const intro      = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', lineHeight: 1.7, maxWidth: '760px', marginBottom: 'var(--space-lg)' }

export const pillButton = (color = 'var(--lavelle-plum-deep)') => ({
  display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', padding: '6px 12px',
  borderRadius: 'var(--radius-full)', border: `1px solid ${color}`, background: 'none', color,
  cursor: 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
})
export const iconBtn = (enabled, size = 30) => ({
  display: 'flex', alignItems: 'center', justifyContent: 'center', width: `${size}px`, height: `${size}px`,
  borderRadius: 'var(--radius-full)', border: '1px solid var(--lavelle-cream)', background: 'var(--lavelle-white)',
  color: 'var(--lavelle-plum-deep)', cursor: enabled ? 'pointer' : 'default', opacity: enabled ? 1 : 0.35, padding: 0,
})
export const tabStyle = on => ({
  fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, padding: '8px 16px',
  borderRadius: 'var(--radius-full)', cursor: 'pointer', border: `1px solid ${on ? NAVY : 'var(--lavelle-cream)'}`,
  background: on ? NAVY : 'var(--lavelle-white)', color: on ? '#F6F5ED' : 'var(--lavelle-plum-deep)',
})

/* A red (or green) message with a close button. */
export function Notice({ text, onClose, ok = false }) {
  if (!text) return null
  const color = ok ? '#2E7D5E' : '#C0392B'
  return (
    <div role={ok ? 'status' : 'alert'} style={{ background: ok ? 'rgba(46,125,94,0.08)' : 'rgba(192,57,43,0.08)', border: `1px solid ${ok ? 'rgba(46,125,94,0.3)' : 'rgba(192,57,43,0.25)'}`, borderRadius: 'var(--radius-lg)', padding: 'var(--space-md) var(--space-lg)', marginBottom: 'var(--space-lg)', display: 'flex', justifyContent: 'space-between', gap: 'var(--space-md)' }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color, lineHeight: 1.6 }}>{text}</p>
      {onClose && <button onClick={onClose} aria-label="Dismiss" style={{ background: 'none', border: 'none', cursor: 'pointer', color, display: 'flex' }}><X size={16} /></button>}
    </div>
  )
}

export function DevModeNotice() {
  return (
    <div style={{ background: 'rgba(228,62,45,0.1)', border: '1px solid rgba(228,62,45,0.35)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-md) var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: '#b83020' }}>
        <strong>Dev mode:</strong> no database is connected, so nothing can be loaded or saved.
      </p>
    </div>
  )
}

/* A dialog over the page; a click outside closes it. */
export function Modal({ title, onClose, children, width = '720px' }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 800, background: 'rgba(25,12,4,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-xl)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div role="dialog" aria-modal="true" aria-label={title} style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-float)', width: '100%', maxWidth: width, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-xl)', borderBottom: '1px solid var(--lavelle-cream)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)' }}>{title}</h2>
          <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--lavelle-gray-mid)', display: 'flex' }}><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

/* "Delete …?" with Cancel and a red button. */
export function ConfirmDelete({ title, text, busy, onCancel, onConfirm, confirmLabel = 'Yes, Delete' }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 900, background: 'rgba(25,12,4,0.6)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-xl)' }}>
      <div role="alertdialog" aria-modal="true" aria-label={title} style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-float)', padding: 'var(--space-2xl)', maxWidth: '440px', width: '100%', textAlign: 'center' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)', marginBottom: 'var(--space-sm)' }}>{title}</h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', marginBottom: 'var(--space-xl)', lineHeight: 1.6 }}>{text}</p>
        <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
          <button onClick={onCancel} className="btn-secondary" style={{ fontSize: '0.8rem' }} disabled={busy}>Cancel</button>
          <button onClick={onConfirm} disabled={busy}
            style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 600, padding: '10px 24px', borderRadius: 'var(--radius-full)', border: 'none', background: '#C0392B', color: 'white', cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.7 : 1 }}>
            {busy ? 'Working…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
