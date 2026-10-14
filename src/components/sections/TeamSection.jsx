import { useTranslation } from 'react-i18next'
import SectionHeader from '../ui/SectionHeader'
import useSiteList from '../../hooks/useSiteList'
import { pick, paragraphs } from '../../data/siteLists'
import { usePhoto } from '../../lib/siteContent'
import { FOUNDED_YEAR } from '../../data/business'

/* Each staff member as a profile: the photo beside the bio (.team-profile in
   globals.css), stacked on phones. The profiles are the admin's Team list. */
export default function TeamSection({ preview = false }) {
  const { t, i18n } = useTranslation()
  const photo = usePhoto()
  const french = i18n.language.startsWith('fr')
  const profiles = useSiteList('team') || []
  const members = preview ? profiles.slice(0, 4) : profiles

  return (
    <section style={{ background:'var(--lavelle-ivory)', padding:'48px 0' }}>
      <div className="container">
        <SectionHeader eyebrow={t('team.eyebrow')} headline={t('team.headline')} subtext={t('team.sub', { year: FOUNDED_YEAR })} align="center" />
        <div style={{ display:'grid', gap:'var(--space-2xl)', maxWidth:'1040px', margin:'0 auto' }}>
          {members.map(({ slug, data: member }) => {
            const displayTitle = pick(member, 'title', french)
            const displayBio = paragraphs(pick(member, 'bio', french))
            const displayQuote = pick(member, 'quote', french)
            const displayAlt = pick(member, 'image_alt', french) || member.name
            return (
              <article key={slug} className="team-profile" data-image-slot={`team-${slug}`}
                style={{ background:'var(--lavelle-white)', borderRadius:'var(--radius-xl)', overflow:'hidden', boxShadow:'var(--shadow-card)' }}>
                <div className="team-profile-photo">
                  {member.image && <img src={photo(member.image)} alt={displayAlt} loading="lazy" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top', display:'block' }} />}
                </div>
                <div className="team-profile-body">
                  <h3 style={{ fontFamily:'var(--font-display)', fontSize:'var(--text-h2)', fontWeight:300, color:'var(--lavelle-plum-deep)', marginBottom:'var(--space-xs)' }}>{member.name}</h3>
                  <p style={{ fontFamily:'var(--font-body)', fontSize:'var(--text-micro)', fontWeight:500, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--lavelle-gold-champagne)', marginBottom:'var(--space-lg)' }}>{displayTitle}</p>
                  {displayBio.map((para, i) => <p key={i} style={{ fontFamily:'var(--font-body)', fontSize:'var(--text-body)', fontWeight:300, color:'var(--lavelle-gray-mid)', lineHeight:1.75, marginTop: i ? 'var(--space-md)' : 0 }}>{para}</p>)}
                  {displayQuote && <p style={{ fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:'1.05rem', color:'var(--lavelle-plum-soft)', marginTop:'var(--space-lg)', lineHeight:1.6 }}>{displayQuote}</p>}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
