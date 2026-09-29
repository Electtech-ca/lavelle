import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Printer, Home } from 'lucide-react'
import CertificateSheet from '../components/ui/CertificateSheet'
import { certificateTier } from '../data/giftsData'
import { fetchCertificate } from '../lib/certificates'

/* ──────────────────────────────────────────────────────────────
   The certificate at the link emailed with it:
     https://sparivier.ca/certificate?code=LV-0100-4823&k=<token>

   It is read through certificate_view(), a database function that
   answers only when the code AND its private token match, so nobody can
   list certificates or find one by guessing codes. The token travels only
   in the emails (to the recipient, and the copy to the buyer).

   The amount shown is the one Stripe charged, as the webhook recorded it,
   so a custom amount prints its real value.
   ────────────────────────────────────────────────────────────── */

export default function CertificateView() {
  const { t } = useTranslation()
  const [params] = useSearchParams()
  const code  = params.get('code') || ''
  const token = params.get('k') || ''
  const [state, setState] = useState({ status: 'loading', cert: null })

  useEffect(() => {
    window.scrollTo(0, 0)
    let live = true
    fetchCertificate(code, token)
      .then(c => { if (live) setState({ status: c ? c.status : 'notFound', cert: c }) })
      .catch(err => {
        console.error('[CertificateView]', err)
        if (live) setState({ status: 'error', cert: null })
      })
    return () => { live = false }
  }, [code, token])

  const c = state.cert
  const shown  = Boolean(c) && (state.status === 'active' || state.status === 'redeemed')
  const amount = c?.face_cents > 0 ? c.face_cents / 100 : null
  const note =
      state.status === 'loading'  ? t('certView.loading')
    : state.status === 'pending'  ? t('certView.pending')
    : state.status === 'error'    ? t('certView.error')
    : state.status === 'redeemed' ? t('certView.redeemed')
    : shown ? null
    : t('certView.notFound')

  return (
    <>
      <div className="no-print" style={{ background: 'linear-gradient(135deg, #2E3350 0%, #1a1f3a 100%)', padding: 'calc(72px + var(--space-xl)) var(--space-xl) var(--space-2xl)', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-pink)', marginBottom: 'var(--space-sm)' }}>
          {t('certView.status')}
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 300, color: 'var(--lavelle-white)', marginBottom: 'var(--space-md)', lineHeight: 1.2 }}>
          {t('certView.heading')}
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'rgba(255,255,255,0.72)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.75 }}>
          {t('certView.sub')}
        </p>
      </div>

      <section style={{ background: 'var(--lavelle-white)', padding: 'var(--space-2xl) var(--space-xl)' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>

          {note && (
            <div className="no-print" role="status" style={{ border: '1px solid var(--lavelle-cream)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)', boxShadow: 'var(--shadow-card)', marginBottom: shown ? 'var(--space-xl)' : 0 }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', lineHeight: 1.75 }}>
                {note}{!shown && state.status !== 'loading' && <> <a href="tel:+12509928084" style={{ color: 'var(--lavelle-plum-soft)' }}>250-992-8084</a>.</>}
              </p>
            </div>
          )}

          {shown && (
            <CertificateSheet
              cert={certificateTier(amount ?? 0)}
              amount={amount}
              code={c.cert_code}
              recipientName={c.recipient_name}
              senderName={c.sender_name}
              message={c.message}
            />
          )}

          {shown && state.status === 'active' && (
            <div className="no-print" style={{ background: 'var(--lavelle-plum-whisper)', borderRadius: 'var(--radius-md)', padding: 'var(--space-lg)', border: '1px solid rgba(49,58,77,0.1)', marginTop: 'var(--space-xl)' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', lineHeight: 1.75 }}>
                <strong style={{ color: 'var(--lavelle-plum-deep)' }}>{t('certConfirm.redeem.label')}</strong>{' '}
                {t('certConfirm.redeem.note')}{' '}
                <a href="tel:+12509928084" style={{ color: 'var(--lavelle-plum-soft)' }}>250-992-8084</a>.
              </p>
            </div>
          )}

          <div className="no-print" style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap', marginTop: 'var(--space-xl)' }}>
            {shown && (
              <button onClick={() => window.print()} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Printer size={16} /> {t('certConfirm.print')}
              </button>
            )}
            <Link to="/giftware" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              <Home size={16} /> {t('certConfirm.back')}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
