import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Clock, User, Tag } from 'lucide-react'
import NewsletterSignup from '../components/sections/NewsletterSignup'
import GoldDivider      from '../components/ui/GoldDivider'
import BookingModal     from '../components/ui/BookingModal'
import { blogPosts, blogCategories } from '../data/blogData'

/* ── Category colour map ── */
const CAT_COLOURS = {
  MediSpa:  '#E9B0B9',
  Skincare: '#E9B0B9',
  Wellness: '#E9B0B9',
  Gourmet:  '#E9B0B9',
  Gifts:    '#E9B0B9',
}

/* ──────────────────────────────────────────────
   ARTICLE VIEW — full post expanded inline
──────────────────────────────────────────────── */
function ArticleView({ post, onBack, onBook }) {
  return (
    <article>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-pink)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 'var(--space-2xl)', padding: 0 }}>
        <ArrowLeft size={16} /> All Articles
      </button>

      {/* Article hero */}
      <div style={{ position: 'relative', width: '100%', height: '420px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: 'var(--space-2xl)' }}>
        <img src={post.image} alt={post.title} loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(46,51,80,0.75) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'var(--space-2xl)' }}>
          <span style={{ display: 'inline-block', fontFamily: 'var(--font-body)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#2E3350', background: '#E9B0B9', borderRadius: 'var(--radius-full)', padding: '4px 14px', marginBottom: 'var(--space-md)' }}>
            {post.category}
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,3.5vw,2.6rem)', fontWeight: 200, color: '#F6F5ED', lineHeight: 1.2, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-md)' }}>
            {post.title}
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-lg)', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 300, color: 'rgba(246,245,237,0.75)' }}>
              <User size={13} /> {post.author}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 300, color: 'rgba(246,245,237,0.75)' }}>
              <Clock size={13} /> {post.readTime}
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 300, color: 'rgba(246,245,237,0.55)' }}>
              {post.date}
            </span>
          </div>
        </div>
      </div>

      {/* Article body */}
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: '1.05rem', color: 'rgba(46,51,80,0.7)', fontStyle: 'italic', lineHeight: 1.8, marginBottom: 'var(--space-2xl)', paddingBottom: 'var(--space-2xl)', borderBottom: '1px solid var(--color-cream)' }}>
          {post.excerpt}
        </p>

        {post.body.map((block, i) => {
          if (block.type === 'paragraph') return (
            <p key={i} style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 'var(--text-body)', color: 'rgba(46,51,80,0.80)', lineHeight: 1.9, marginBottom: 'var(--space-lg)' }}>
              {block.text}
            </p>
          )
          if (block.type === 'heading') return (
            <h2 key={i} style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: '#2E3350', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 'var(--space-2xl)', marginBottom: 'var(--space-md)', paddingBottom: 'var(--space-sm)', borderBottom: '2px solid #E9B0B9' }}>
              {block.text}
            </h2>
          )
          if (block.type === 'cta') return (
            <div key={i} style={{ marginTop: 'var(--space-2xl)', padding: 'var(--space-xl)', background: '#2E3350', borderRadius: 'var(--radius-xl)', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', fontWeight: 300, color: 'rgba(246,245,237,0.75)', marginBottom: 'var(--space-lg)' }}>
                Ready to experience this at Sparivier?
              </p>
              <a href={block.href} className="btn-primary">{block.text}</a>
            </div>
          )
          return null
        })}

        {/* Author strip */}
        <div style={{ marginTop: 'var(--space-3xl)', paddingTop: 'var(--space-xl)', borderTop: '1px solid var(--color-cream)', display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#E9B0B9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1.1rem', color: '#2E3350' }}>S</span>
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-small)', color: '#2E3350' }}>{post.author}</p>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 'var(--text-small)', color: 'rgba(46,51,80,0.55)' }}>Sparivier — Quesnel, BC</p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-body)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#E9B0B9' }}>
              <Tag size={12} /> {post.category}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}

/* ──────────────────────────────────────────────
   POST CARD — grid tile
──────────────────────────────────────────────── */
function PostCard({ post, onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={() => onClick(post)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ all: 'unset', cursor: 'pointer', display: 'block', background: 'white', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: hovered ? 'var(--shadow-hover)' : 'var(--shadow-card)', transform: hovered ? 'translateY(-6px)' : 'none', transition: 'all 0.3s ease', textAlign: 'left' }}>
      {/* Image */}
      <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
        <img src={post.image} alt={post.title} loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hovered ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.5s ease' }} />
        <span style={{ position: 'absolute', top: 'var(--space-md)', left: 'var(--space-md)', fontFamily: 'var(--font-body)', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#2E3350', background: '#E9B0B9', borderRadius: 'var(--radius-full)', padding: '3px 12px' }}>
          {post.category}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: 'var(--space-xl)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 300, color: 'rgba(46,51,80,0.45)' }}>{post.date}</span>
          <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#E9B0B9', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 300, color: 'rgba(46,51,80,0.45)' }}>{post.readTime}</span>
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: '#2E3350', lineHeight: 1.35, marginBottom: 'var(--space-md)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {post.title}
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 'var(--text-small)', color: 'rgba(46,51,80,0.65)', lineHeight: 1.7, marginBottom: 'var(--space-lg)' }}>
          {post.excerpt}
        </p>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#E9B0B9', display: 'flex', alignItems: 'center', gap: '6px' }}>
          Read Article <span>→</span>
        </span>
      </div>
    </button>
  )
}

/* ──────────────────────────────────────────────
   FEATURED POST — wide cinematic card
──────────────────────────────────────────────── */
function FeaturedCard({ post, onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={() => onClick(post)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ all: 'unset', cursor: 'pointer', display: 'block', width: '100%', position: 'relative', height: '460px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-hover)', marginBottom: 'var(--space-2xl)', transition: 'transform 0.4s ease, box-shadow 0.4s ease', transform: hovered ? 'translateY(-4px)' : 'none' }}>
      <img src={post.image} alt={post.title} loading="eager"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: hovered ? 'scale(1.03)' : 'scale(1)', transition: 'transform 0.6s ease' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(46,51,80,0.90) 0%, rgba(46,51,80,0.55) 50%, rgba(46,51,80,0.15) 100%)' }} />

      <div style={{ position: 'absolute', top: '50%', left: 'var(--space-3xl)', transform: 'translateY(-50%)', maxWidth: '560px', textAlign: 'left' }}>
        <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#2E3350', background: '#E9B0B9', borderRadius: 'var(--radius-full)', padding: '4px 14px' }}>
            Featured
          </span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(233,176,185,0.75)' }}>
            {post.category}
          </span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2.4rem)', fontWeight: 200, color: '#F6F5ED', lineHeight: 1.2, marginBottom: 'var(--space-md)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {post.title}
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 'var(--text-small)', color: 'rgba(246,245,237,0.80)', lineHeight: 1.75, marginBottom: 'var(--space-xl)' }}>
          {post.excerpt}
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-xl)', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#E9B0B9', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Read Article <span style={{ fontSize: '1.1rem' }}>→</span>
          </span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 300, color: 'rgba(246,245,237,0.50)' }}>
            {post.readTime}
          </span>
        </div>
      </div>
    </button>
  )
}

/* ──────────────────────────────────────────────
   MAIN BLOG PAGE
──────────────────────────────────────────────── */
export default function Blog() {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedPost, setSelectedPost] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const featured = blogPosts.find(p => p.featured)
  const filtered = activeCategory === 'All'
    ? blogPosts
    : blogPosts.filter(p => p.category === activeCategory)

  // If a post is selected, show article view
  if (selectedPost) {
    return (
      <>
        <div style={{ background: '#F6F5ED', minHeight: '100vh', paddingTop: 'calc(72px + var(--space-2xl))', paddingBottom: 'var(--space-3xl)' }}>
          <div className="container" style={{ maxWidth: '900px' }}>
            <ArticleView
              post={selectedPost}
              onBack={() => setSelectedPost(null)}
              onBook={() => setModalOpen(true)}
            />
          </div>
        </div>
        <GoldDivider />
        <NewsletterSignup />
        <BookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    )
  }

  return (
    <>
      {/* ── Page Hero ── */}
      <div style={{ position: 'relative', height: '52vh', minHeight: '380px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <img
          src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=1920&h=700&fit=crop&q=90"
          alt="Sparivier Journal"
          loading="eager"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(46,51,80,0.68)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '620px', padding: 'calc(72px + var(--space-xl)) var(--space-xl) var(--space-xl)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-md)' }}>
            ✦ {t('blog.hero.eyebrow')}
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h1)', fontWeight: 200, color: '#F6F5ED', lineHeight: 1.1, marginBottom: 'var(--space-md)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {t('blog.hero.headline')}
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '1rem', color: 'rgba(246,245,237,0.80)', lineHeight: 1.75 }}>
            {t('blog.hero.sub')}
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ background: '#F6F5ED', padding: 'var(--space-3xl) var(--space-xl)' }}>
        <div className="container">

          {/* Featured post */}
          {featured && activeCategory === 'All' && (
            <FeaturedCard post={featured} onClick={setSelectedPost} />
          )}

          {/* Category filter */}
          <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', marginBottom: 'var(--space-2xl)', justifyContent: activeCategory === 'All' ? 'flex-start' : 'flex-start' }}>
            {blogCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 600,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  padding: '8px 20px', borderRadius: 'var(--radius-full)',
                  border: '1.5px solid',
                  borderColor: activeCategory === cat ? '#E9B0B9' : 'rgba(46,51,80,0.18)',
                  background: activeCategory === cat ? '#E9B0B9' : 'transparent',
                  color: activeCategory === cat ? '#2E3350' : 'rgba(46,51,80,0.55)',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Post grid */}
          {filtered.length === 0 ? (
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, color: 'rgba(46,51,80,0.45)', textAlign: 'center', padding: 'var(--space-3xl) 0' }}>
              No articles in this category yet — check back soon.
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-xl)' }}>
              {filtered.map(post => (
                <PostCard key={post.id} post={post} onClick={setSelectedPost} />
              ))}
            </div>
          )}

          {/* Bottom CTA strip */}
          <div style={{ marginTop: 'var(--space-3xl)', textAlign: 'center', padding: 'var(--space-2xl)', background: '#2E3350', borderRadius: 'var(--radius-xl)' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#E9B0B9', marginBottom: 'var(--space-md)' }}>
              ✦ Ready to Visit?
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 200, color: '#F6F5ED', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-md)' }}>
              {t('blog.cta.headline')}
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 'var(--text-small)', color: 'rgba(246,245,237,0.70)', marginBottom: 'var(--space-xl)', maxWidth: '480px', margin: '0 auto var(--space-xl)' }}>
              {t('blog.cta.sub')}
            </p>
            <button className="btn-primary" onClick={() => setModalOpen(true)}>{t('cta.book')}</button>
          </div>

        </div>
      </div>

      <GoldDivider />
      <NewsletterSignup />
      <BookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
