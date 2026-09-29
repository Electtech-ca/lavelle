import { Gift } from 'lucide-react'
import { useTranslation } from 'react-i18next'

/* ──────────────────────────────────────────────────────────────
   A gift certificate as a printable sheet, in its tier's colours.

   Shown on the page Stripe returns the buyer to (CertificateConfirmed)
   and at the link emailed with the certificate (CertificateView).
   @media print keeps only .print-sheet, so printing gives exactly this.

   Sizes are in container units (cqi) so the sheet scales with the
   space it gets: a phone opening the emailed link sees the same
   layout as a printed page, not a squeezed one.
   ────────────────────────────────────────────────────────────── */

/* The gift logo's colour: the tier's accent on light tiers, its gold on dark. */
export const certInk = cert => (cert.dark ? cert.goldColor : cert.accentColor)

/* The gift logo on every certificate. The emailed certificate uses the same
   drawing as an image (public/email/gift-<amount>.png), so the website,
   the printout and the email all match. */
export function GiftMedallion({ cert, size = 48 }) {
  const ink = certInk(cert)
  return (
    <span aria-hidden="true" style={{
      width: `${size}px`, height: `${size}px`, borderRadius: '50%', flexShrink: 0,
      border: `1.5px solid ${ink}`, color: ink,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Gift size={Math.round(size * 0.52)} strokeWidth={1.6} />
    </span>
  )
}

export const certTitle = cert =>
  !cert.label ? 'Spa Rivier' : cert.label.startsWith('Spa Rivier') ? cert.label : `Spa Rivier ${cert.label}`

export const formatAmount = dollars =>
  '$' + dollars.toLocaleString('en-CA', { minimumFractionDigits: dollars % 1 ? 2 : 0, maximumFractionDigits: 2 })

/**
 * `amount` is in dollars, or null while it is not known (a custom amount
 * before the payment is recorded), which prints "As paid".
 */
export default function CertificateSheet({ cert, amount, code, recipientName, senderName, message }) {
  const { t } = useTranslation()
  const dark = Boolean(cert.dark)
  const ink = certInk(cert)
  const label = {
    fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600,
    letterSpacing: '0.16em', textTransform: 'uppercase',
    color: dark ? 'rgba(255,255,255,0.55)' : cert.accentColor, marginBottom: '4px',
  }
  const value = {
    fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 300,
    color: dark ? '#ffffff' : cert.textColor, lineHeight: 1.45, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere',
  }
  const rule = { height: '1px', background: `linear-gradient(to right, transparent, ${cert.borderColor}, transparent)` }
  const corner = { position: 'absolute', width: '42px', height: '42px', opacity: 0.85 }

  return (
    <div style={{ containerType: 'inline-size' }}>
      <div className="print-sheet" style={{
        position: 'relative', background: cert.gradient, borderRadius: 'var(--radius-xl)',
        border: `1px solid ${cert.borderColor}`, padding: 'clamp(28px, 8cqi, 64px) clamp(20px, 8cqi, 64px)',
        boxShadow: 'var(--shadow-card)', overflow: 'hidden',
        WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact',
      }}>
        <div style={{ ...corner, top: '16px', left: '16px', borderTop: `1px solid ${cert.borderColor}`, borderLeft: `1px solid ${cert.borderColor}`, borderRadius: '4px 0 0 0' }} />
        <div style={{ ...corner, top: '16px', right: '16px', borderTop: `1px solid ${cert.borderColor}`, borderRight: `1px solid ${cert.borderColor}`, borderRadius: '0 4px 0 0' }} />
        <div style={{ ...corner, bottom: '16px', left: '16px', borderBottom: `1px solid ${cert.borderColor}`, borderLeft: `1px solid ${cert.borderColor}`, borderRadius: '0 0 0 4px' }} />
        <div style={{ ...corner, bottom: '16px', right: '16px', borderBottom: `1px solid ${cert.borderColor}`, borderRight: `1px solid ${cert.borderColor}`, borderRadius: '0 0 4px 0' }} />

        {/* Masthead: the gift logo and "Gift Certificate", large */}
        <div style={{ textAlign: 'center' }}>
          <GiftMedallion cert={cert} size={60} />
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 'clamp(1.05rem, 4.6cqi, 1.75rem)', fontWeight: 700,
            letterSpacing: '0.2em', textTransform: 'uppercase', color: ink, lineHeight: 1.25, margin: '14px 0 6px',
          }}>
            {t('giftCert.card.label')}
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 400, fontStyle: 'italic', color: dark ? 'rgba(255,255,255,0.85)' : cert.textColor }}>
            {certTitle(cert)}
          </p>
        </div>

        <div style={{ ...rule, margin: 'var(--space-lg) 0' }} />

        {/* Amount */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
          <p style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(2.6rem, 13cqi, 4.6rem)', fontWeight: 300,
            lineHeight: 1, letterSpacing: '-0.02em', color: cert.accentColor,
            textShadow: dark ? `0 0 40px ${cert.shimmer}` : 'none',
          }}>
            {amount != null && amount > 0 ? formatAmount(amount) : t('certConfirm.amountPaid')}
          </p>
          {cert.subtitle && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontStyle: 'italic', fontWeight: 300, color: dark ? 'rgba(255,255,255,0.6)' : cert.accentColor, marginTop: '8px' }}>
              {cert.subtitle}
            </p>
          )}
        </div>

        {/* The code — what the spa redeems */}
        <div style={{
          textAlign: 'center', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)',
          background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.55)',
          border: `1px solid ${cert.borderColor}`, marginBottom: 'var(--space-lg)',
        }}>
          <p style={{ ...label, marginBottom: '6px' }}>{t('certConfirm.certCode')}</p>
          <p style={{
            fontFamily: 'monospace', fontSize: 'clamp(1.2rem, 5cqi, 1.7rem)', fontWeight: 700,
            letterSpacing: '0.18em', color: dark ? '#ffffff' : cert.textColor,
          }}>
            {code}
          </p>
        </div>

        {/* To / From / Message */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-lg)' }}>
          {recipientName && (
            <div><p style={label}>{t('certConfirm.to')}</p><p style={value}>{recipientName}</p></div>
          )}
          {senderName && (
            <div><p style={label}>{t('certConfirm.from')}</p><p style={value}>{senderName}</p></div>
          )}
        </div>
        {message && (
          <div style={{ marginTop: 'var(--space-lg)' }}>
            <p style={label}>{t('certConfirm.message')}</p>
            <p style={{ ...value, fontStyle: 'italic' }}>{message}</p>
          </div>
        )}

        <div style={{ ...rule, margin: 'var(--space-lg) 0 var(--space-md)' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
          <p style={{ ...label, marginBottom: 0 }}>
            <span style={{ whiteSpace: 'nowrap' }}>{t('giftCert.card.valid')}</span> · <span style={{ whiteSpace: 'nowrap' }}>{t('giftCert.card.services')}</span>
          </p>
          <p style={{ ...label, marginBottom: 0 }}>
            <span style={{ whiteSpace: 'nowrap' }}>353 Reid Street, Quesnel</span> · <span style={{ whiteSpace: 'nowrap' }}>250-992-8084</span>
          </p>
        </div>
      </div>
    </div>
  )
}
