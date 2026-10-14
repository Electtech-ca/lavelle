import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { usePhoto } from '../../lib/siteContent'
import SectionHeader from '../ui/SectionHeader'

/* The Spa Rivier Experience: Spa and MediSpa as two equal features across the
   top, then four smaller boxes (.experience-grid in globals.css). Each whole
   box links to its page, and the boxes stack in this order on phones. Photos
   are the client's own services and displays. */
const LINES = [
  { key: 'spa',      to: '/spa',                   image: '/images/home/spa-treatment.jpg',     pos: 'center 30%', feature: true },
  { key: 'medispa',  to: '/medispa',               image: '/images/home/medispa-laser.jpg',     pos: 'center 30%', feature: true },
  { key: 'salon',    to: '/salon',                 image: '/images/home/salon-service.jpg',     pos: '65% 58%' },
  { key: 'boutique', to: '/boutique',              image: '/images/home/boutique-display.jpg',  pos: 'center 32%' },
  { key: 'gifts',    to: '/giftware',              image: '/images/home/giftware-display.jpg',  pos: 'center 40%' },
  { key: 'certs',    to: '/giftware#certificates', image: '/images/home/gift-certificates.jpg', pos: 'center 55%' },
]

export default function BusinessLineGrid() {
  const { t } = useTranslation()
  const photo = usePhoto()

  return (
    <section id="experience" style={{ background: 'var(--color-white)', padding: '48px var(--space-xl)', scrollMarginTop: '72px' }}>
      <div className="container">
        <SectionHeader
          eyebrow={t('grid.eyebrow')}
          headline={t('grid.headline')}
          subtext={t('grid.sub')}
          align="center"
        />

        <div className="experience-grid">
          {LINES.map(line => (
            <Link key={line.key} to={line.to} className={`experience-card${line.feature ? ' experience-card--feature' : ''}`}>
              <img src={photo(line.image)} alt="" loading="lazy" style={{ objectPosition: line.pos }} />
              <div className="experience-card__text">
                <p className="experience-card__eyebrow">{t(`grid.${line.key}.eyebrow`)}</p>
                <h3 className="experience-card__title">{t(`grid.${line.key}.title`)}</h3>
                <p className="experience-card__desc">{t(`grid.${line.key}.desc`)}</p>
                <span className="experience-card__link">{t(`grid.${line.key}.link`)} <span aria-hidden="true">→</span></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
