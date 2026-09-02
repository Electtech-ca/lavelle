import { useTranslation } from 'react-i18next'

export default function LanguageToggle() {
  const { i18n } = useTranslation()
  const current = i18n.language

  function toggle(lang) {
    i18n.changeLanguage(lang)
    localStorage.setItem('lavelle-lang', lang)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-full)', padding: '3px' }}>
      {['en', 'fr'].map(lang => (
        <button
          key={lang}
          onClick={() => toggle(lang)}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-micro)',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            cursor: 'pointer',
            background: current === lang ? 'var(--lavelle-gold-champagne)' : 'transparent',
            color: current === lang ? 'var(--lavelle-plum-deep)' : 'rgba(255,255,255,0.7)',
            transition: 'all 0.2s ease',
          }}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
