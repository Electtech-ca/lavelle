import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Printer, Home } from 'lucide-react'
import { giftCertificates } from '../data/giftsData'

/* ──────────────────────────────────────────────────────────────
   Where Stripe returns a guest after paying for a certificate.

   Stripe substitutes the real session id into the {CHECKOUT_SESSION_ID}
   placeholder on the Payment Link's success URL, so it arrives here as
   ?session_id=cs_… We keep that token but never show it: it is long,
   meaningless to the guest, and the certificate code is what the spa
   actually redeems. Staff match a payment to an order in Stripe by the
   certificate code, which rides along as client_reference_id.

   This page deliberately writes NOTHING to the database. The session id
   arrives in a URL the guest controls, so trusting it far enough to
   store it would mean opening an anonymous UPDATE on gift_orders that
   anyone could post a forged token to.

   The certificate below is the printable artefact: it renders in the
   tier's own colours and is the only thing @media print keeps.
   ────────────────────────────────────────────────────────────── */

const PENDING_KEY = 'sparivier.pendingCertificate'

/* The tier's palette, so the printed certificate matches what was bought. */
function tierFor(amount) {
  return giftCertificates.find(c => c.amount === Number(amount)) || giftCertificates[0]
}

export default function CertificateConfirmed() {
  const { t } = useTranslation()
  const [params] = useSearchParams()
  const [pending, setPending] = useState(null)

  const paid = Boolean(params.get('session_id'))

  useEffect(() => {
    window.scrollTo(0, 0)
    // Stashed by the purchase modal just before the redirect to Stripe.
    try {
      const raw = sessionStorage.getItem(PENDING_KEY)
      if (raw) {
        setPending(JSON.parse(raw))
        sessionStorage.removeItem(PENDING_KEY)
      }
    } catch {
      /* private browsing, or cleared storage — the code is emailed too */
    }
  }, [])

  const cert = tierFor(pending?.amount)
  const dark = Boolean(cert.dark)
  const label = {
    fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600,
    letterSpacing: '0.16em', textTransform: 'uppercase',
    color: dark ? 'rgba(255,255,255,0.55)' : cert.accentColor, marginBottom: '4px',
  }
  const value = {
    fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 300,
    color: dark ? '#ffffff' : cert.textColor, lineHeight: 1.45, whiteSpace: 'pre-wrap',
  }
  const corner = { position: 'absolute', width: '42px', height: '42px', opacity: 0.85 }

  return (
    <>
      <div className="no-print" style={{ background: 'linear-gradient(135deg, #2E3350 0%, #1a1f3a 100%)', padding: 'calc(72px + var(--space-xl)) var(--space-xl) var(--space-2xl)', textAlign: 'center' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(46,125,94,0.2)', border: '2px solid #2E7D5E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-lg)', fontSize: '1.5rem', color: '#2E7D5E' }}>✓</div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2E7D5E', marginBottom: 'var(--space-sm)' }}>
          {t('certConfirm.status')}
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 300, color: 'var(--lavelle-white)', marginBottom: 'var(--space-md)', lineHeight: 1.2 }}>
          {t('certConfirm.heading')}
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(255,255,255,0.72)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.75 }}>
          {t('certConfirm.sub')}
        </p>
      </div>

      <section style={{ background: 'var(--lavelle-white)', padding: 'var(--space-2xl) var(--space-xl)' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>

          {pending ? (
            /* ── The certificate itself — this is what prints ── */
            <div className="print-sheet" style={{
              position: 'relative', background: cert.gradient, borderRadius: 'var(--radius-xl)',
              border: `1px solid ${cert.borderColor}`, padding: 'var(--space-2xl)',
              boxShadow: 'var(--shadow-card)', overflow: 'hidden',
              WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact',
            }}>
              <div style={{ ...corner, top: '16px', left: '16px', borderTop: `1px solid ${cert.borderColor}`, borderLeft: `1px solid ${cert.borderColor}`, borderRadius: '4px 0 0 0' }} />
              <div style={{ ...corner, top: '16px', right: '16px', borderTop: `1px solid ${cert.borderColor}`, borderRight: `1px solid ${cert.borderColor}`, borderRadius: '0 4px 0 0' }} />
              <div style={{ ...corner, bottom: '16px', left: '16px', borderBottom: `1px solid ${cert.borderColor}`, borderLeft: `1px solid ${cert.borderColor}`, borderRadius: '0 0 0 4px' }} />
              <div style={{ ...corner, bottom: '16px', right: '16px', borderBottom: `1px solid ${cert.borderColor}`, borderRight: `1px solid ${cert.borderColor}`, borderRadius: '0 0 4px 0' }} />

              {/* Masthead */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-lg)' }}>
                <div>
                  <p style={{ ...label, letterSpacing: '0.28em' }}>{t('giftCert.card.label')}</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 400, fontStyle: 'italic', color: dark ? '#ffffff' : cert.textColor }}>
                    Spa Rivier {cert.label}
                  </p>
                </div>
                <div style={{
                  width: '54px', height: '54px', borderRadius: '50%', flexShrink: 0,
                  background: dark
                    ? `radial-gradient(circle, ${cert.goldColor} 0%, ${cert.accentColor} 100%)`
                    : 'radial-gradient(circle, #e43e2d 0%, #b83020 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
                }}>
                  <span style={{ color: dark ? '#0f1a26' : '#313a4d', fontSize: '1.1rem' }}>✦</span>
                </div>
              </div>

              <div style={{ margin: 'var(--space-lg) 0', height: '1px', background: `linear-gradient(to right, transparent, ${cert.borderColor}, transparent)` }} />

              {/* Amount */}
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
                <p style={{
                  fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem,9vw,4.6rem)', fontWeight: 300,
                  lineHeight: 1, letterSpacing: '-0.02em', color: cert.accentColor,
                  textShadow: dark ? `0 0 40px ${cert.shimmer}` : 'none',
                }}>
                  {Number(pending.amount) > 0
                    ? `$${Number(pending.amount).toLocaleString('en-CA')}`
                    : t('certConfirm.amountPaid')}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontStyle: 'italic', fontWeight: 300, color: dark ? 'rgba(255,255,255,0.6)' : cert.accentColor, marginTop: '8px' }}>
                  {cert.subtitle}
                </p>
              </div>

              {/* The code — what the spa redeems */}
              <div style={{
                textAlign: 'center', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)',
                background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.55)',
                border: `1px solid ${cert.borderColor}`, marginBottom: 'var(--space-lg)',
              }}>
                <p style={{ ...label, marginBottom: '6px' }}>{t('certConfirm.certCode')}</p>
                <p style={{
                  fontFamily: 'monospace', fontSize: 'clamp(1.2rem,4vw,1.7rem)', fontWeight: 700,
                  letterSpacing: '0.18em', color: dark ? '#ffffff' : cert.textColor,
                }}>
                  {pending.certCode}
                </p>
              </div>

              {/* To / From / Message */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-lg)' }}>
                {pending.recipientName && (
                  <div><p style={label}>{t('certConfirm.to')}</p><p style={value}>{pending.recipientName}</p></div>
                )}
                {pending.senderName && (
                  <div><p style={label}>{t('certConfirm.from')}</p><p style={value}>{pending.senderName}</p></div>
                )}
              </div>
              {pending.message && (
                <div style={{ marginTop: 'var(--space-lg)' }}>
                  <p style={label}>{t('certConfirm.message')}</p>
                  <p style={{ ...value, fontStyle: 'italic' }}>{pending.message}</p>
                </div>
              )}

              <div style={{ margin: 'var(--space-lg) 0 var(--space-md)', height: '1px', background: `linear-gradient(to right, transparent, ${cert.borderColor}, transparent)` }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                <p style={{ ...label, marginBottom: 0 }}>{t('giftCert.card.valid')} · {t('giftCert.card.services')}</p>
                <p style={{ ...label, marginBottom: 0 }}>353 Reid Street, Quesnel · 250-992-8084</p>
              </div>
            </div>
          ) : (
            <div style={{ border: '1px solid var(--lavelle-cream)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)', boxShadow: 'var(--shadow-card)' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', lineHeight: 1.75 }}>
                {paid ? t('certConfirm.noDetails') : t('certConfirm.noRef')}
              </p>
            </div>
          )}

          <div className="no-print" style={{ background: 'var(--lavelle-plum-whisper)', borderRadius: 'var(--radius-md)', padding: 'var(--space-lg)', border: '1px solid rgba(49,58,77,0.1)', marginTop: 'var(--space-xl)' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', lineHeight: 1.75 }}>
              <strong style={{ color: 'var(--lavelle-plum-deep)' }}>{t('certConfirm.redeem.label')}</strong>{' '}
              {t('certConfirm.redeem.note')}{' '}
              <a href="tel:+12509928084" style={{ color: 'var(--lavelle-plum-soft)' }}>250-992-8084</a>.
            </p>
          </div>

          <div className="no-print" style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap', marginTop: 'var(--space-xl)' }}>
            <button onClick={() => window.print()} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Printer size={16} /> {t('certConfirm.print')}
            </button>
            <Link to="/giftware" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              <Home size={16} /> {t('certConfirm.back')}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
