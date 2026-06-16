import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import GoldDivider from '../components/ui/GoldDivider'

export default function MemberPortal() {
  const { t } = useTranslation()
  const { user, signOut } = useAuth()
  const [tab, setTab] = useState(0)

  const tabs = [t('member.tab.profile'), t('member.tab.bookings'), t('member.tab.rewards'), t('member.tab.certs')]

  const cardStyle = { background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2xl)', boxShadow: 'var(--shadow-card)', marginBottom: 'var(--space-xl)' }

  return (
    <>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, var(--lavelle-plum-deep) 0%, var(--lavelle-plum-mid) 100%)', padding: 'calc(72px + var(--space-2xl)) var(--space-xl) var(--space-2xl)' }}>
        <div className="container">
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--lavelle-gold-champagne)', marginBottom: 'var(--space-sm)' }}>✦ {t('member.eyebrow')}</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h1)', fontWeight: 300, color: 'var(--lavelle-white)', marginBottom: 'var(--space-sm)' }}>{t('member.heading')}</h1>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--lavelle-gold-champagne)' }}>{user?.email}</p>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ background: 'var(--lavelle-white)', borderBottom: '1px solid var(--lavelle-cream)', position: 'sticky', top: '72px', zIndex: 100, overflowX: 'auto' }}>
        <div className="container" style={{ display: 'flex', gap: 0 }}>
          {tabs.map((label, i) => (
            <button key={label} onClick={() => setTab(i)}
              style={{
                fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 500,
                letterSpacing: '0.08em', textTransform: 'uppercase', padding: '18px 28px',
                border: 'none', borderBottom: tab === i ? '2px solid var(--lavelle-gold-champagne)' : '2px solid transparent',
                background: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                color: tab === i ? 'var(--lavelle-plum-deep)' : 'var(--lavelle-gray-mid)',
                transition: 'color 0.2s',
              }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--lavelle-ivory)', padding: 'var(--space-3xl) var(--space-xl)', minHeight: '60vh' }}>
        <div className="container" style={{ maxWidth: '800px' }}>

          {/* Profile */}
          {tab === 0 && (
            <>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 300, color: 'var(--lavelle-plum-deep)', marginBottom: 'var(--space-xl)' }}>{t('member.tab.profile')}</h2>
              <div style={cardStyle}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-lg)' }}>
                  <div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--lavelle-gray-mid)', marginBottom: 'var(--space-xs)' }}>{t('member.profile.email')}</p>
                    <p style={{ fontFamily: 'var(--font-body)', color: 'var(--lavelle-charcoal)' }}>{user?.email}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--lavelle-gray-mid)', marginBottom: 'var(--space-xs)' }}>{t('member.profile.since')}</p>
                    <p style={{ fontFamily: 'var(--font-body)', color: 'var(--lavelle-charcoal)' }}>{user?.created_at ? new Date(user.created_at).toLocaleDateString('en-CA', { year: 'numeric', month: 'long' }) : '—'}</p>
                  </div>
                </div>
              </div>
              <button className="btn-secondary" onClick={signOut} style={{ fontSize: '0.78rem' }}>{t('member.profile.signOut')}</button>
            </>
          )}

          {/* Bookings */}
          {tab === 1 && (
            <>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 300, color: 'var(--lavelle-plum-deep)', marginBottom: 'var(--space-xl)' }}>{t('member.tab.bookings')}</h2>
              <div style={cardStyle}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--lavelle-plum-soft)', textAlign: 'center', padding: 'var(--space-xl) 0' }}>{t('member.bookings.empty')}</p>
                <div style={{ textAlign: 'center' }}>
                  <a href="/spa" className="btn-primary">{t('member.bookings.cta')}</a>
                </div>
              </div>
            </>
          )}

          {/* Rewards */}
          {tab === 2 && (
            <>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 300, color: 'var(--lavelle-plum-deep)', marginBottom: 'var(--space-xl)' }}>{t('member.rewards.heading')}</h2>
              <div style={cardStyle}>
                <div style={{ textAlign: 'center', padding: 'var(--space-xl) 0' }}>
                  <p style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>🥂</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--lavelle-gold-champagne)', marginBottom: 'var(--space-sm)' }}>{t('member.rewards.tier')}</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 300, color: 'var(--lavelle-plum-deep)', lineHeight: 1 }}>0 <span style={{ fontSize: '1rem', color: 'var(--lavelle-gray-mid)' }}>{t('member.rewards.points')}</span></p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-gray-mid)', marginTop: 'var(--space-md)' }}>{t('member.rewards.info')}</p>
                </div>
              </div>
            </>
          )}

          {/* Gift Certificates */}
          {tab === 3 && (
            <>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 300, color: 'var(--lavelle-plum-deep)', marginBottom: 'var(--space-xl)' }}>{t('member.certs.heading')}</h2>
              <div style={cardStyle}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--lavelle-plum-soft)', textAlign: 'center', padding: 'var(--space-xl) 0' }}>{t('member.certs.empty')}</p>
                <div style={{ textAlign: 'center' }}>
                  <a href="/gift-certificates" className="btn-primary">{t('member.certs.cta')}</a>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
      <GoldDivider />
    </>
  )
}
