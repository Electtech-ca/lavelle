import { useTranslation } from 'react-i18next'
import SectionHeader from '../ui/SectionHeader'
import AwardBadge from '../ui/AwardBadge'
import { awards } from '../../data/awardsData'

export default function AwardsSection() {
  const { t } = useTranslation()

  return (
    <section style={{ background:'var(--lavelle-gold-shimmer)', padding:'var(--space-3xl) 0', overflow:'hidden' }}>
      <div className="container">
        <SectionHeader eyebrow={t('awards.eyebrow')} headline={t('awards.headline')} subtext={t('awards.sub')} align="center" />
      </div>
      <div style={{ position:'relative', overflow:'hidden' }}>
        <div style={{ display:'flex', gap:'var(--space-xl)', padding:'var(--space-md) var(--space-xl)', animation:'scrollLeft 30s linear infinite', width:'max-content' }}
          onMouseEnter={e => e.currentTarget.style.animationPlayState='paused'}
          onMouseLeave={e => e.currentTarget.style.animationPlayState='running'}>
          {[...awards, ...awards].map((award, i) => (
            <AwardBadge key={i} year={award.year} title={award.title} org={award.org} />
          ))}
        </div>
      </div>
    </section>
  )
}
