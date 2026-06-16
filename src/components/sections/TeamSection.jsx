import { useTranslation } from 'react-i18next'
import SectionHeader from '../ui/SectionHeader'
import { teamMembers } from '../../data/teamData'

export default function TeamSection({ preview = false }) {
  const { t } = useTranslation()
  const members = preview ? teamMembers.slice(0, 4) : teamMembers

  return (
    <section style={{ background:'var(--lavelle-ivory)', padding:'var(--space-3xl) var(--space-xl)' }}>
      <div className="container">
        <SectionHeader eyebrow={t('team.eyebrow')} headline={t('team.headline')} subtext={t('team.sub')} align="center" />
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'var(--space-2xl)' }}>
          {members.map(member => (
            <div key={member.name} data-image-slot={`team-${member.name.toLowerCase()}`}
              style={{ background:'var(--lavelle-white)', borderRadius:'var(--radius-xl)', overflow:'hidden', boxShadow:'var(--shadow-card)' }}>
              <div style={{ height:'280px', overflow:'hidden' }}>
                <img src={member.image} alt={member.name} loading="lazy" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top' }} />
              </div>
              <div style={{ padding:'var(--space-xl)' }}>
                <h3 style={{ fontFamily:'var(--font-display)', fontSize:'var(--text-h3)', fontWeight:400, color:'var(--lavelle-plum-deep)', marginBottom:'var(--space-xs)' }}>{member.name}</h3>
                <p style={{ fontFamily:'var(--font-body)', fontSize:'var(--text-micro)', fontWeight:500, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--lavelle-gold-champagne)', marginBottom:'var(--space-md)' }}>{member.title}</p>
                <p style={{ fontFamily:'var(--font-body)', fontSize:'var(--text-small)', color:'var(--lavelle-gray-mid)', lineHeight:1.7 }}>{member.bio}</p>
                {member.quote && <p style={{ fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:'0.95rem', color:'var(--lavelle-plum-soft)', marginTop:'var(--space-md)', lineHeight:1.6 }}>{member.quote}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
