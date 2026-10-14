import { haircareBrands } from './haircareBrands'
import { haircareBrandsFrench } from './haircareBrandsTranslations'
import { skincareBrands } from './skincareBrands'
import { skincareBrandsFrench } from './skincareBrandsTranslations'
import { bathBodyBrands, bathBodyAccessories } from './bathBodyBrands'
import { bathBodyBrandsFrench } from './bathBodyBrandsTranslations'
import { teamMembers } from './teamData'
import { teamMemberTranslations } from './teamTranslations'
import { faqItems } from './spaData'
import { events } from './eventsData'
import { dailyPromos } from './dailyPromos'
import { blogPosts } from './blogData'
import { blogTranslations, blogCategoryTranslations } from './blogTranslations'

/* ──────────────────────────────────────────────────────────────
   The lists the admin edits item by item: the Haircare, Skincare and
   Bath & Body brands, the Team profiles, the Spa FAQ, and What's
   Happening's events, daily promo and articles.

   Each item is a row of the site_items table: `list` (a key below),
   `slug`, `data` (the fields below, as JSON), `active`, `sort_order`.
   A field with `fr: true` has a French twin, `<name>_fr`; left blank,
   the French site shows the English.

   `fallback` is the copy kept in code: the table's first rows came from
   it (supabase/site-editing.sql), and the pages show it when the
   database can't be read.

   Field types: text, textarea, paragraphs (a blank line between
   paragraphs), lines (one item per line), image, images (the first is
   the tile), url, checkbox, number.
   ────────────────────────────────────────────────────────────── */

const joinParas = a => (a || []).join('\n\n')

/* A brand's own lines: "Nioxin — thinning hair & scalp support", one per line. */
const brandFields = ({ nameFr = false, shortName = false, lines = false } = {}) => [
  { name: 'name',       label: 'Brand name', type: 'text', required: true, fr: nameFr },
  ...(shortName ? [{ name: 'short_name', label: 'Short name', type: 'text', hint: 'Used in the tile’s “Explore … at Spa Rivier” line. Blank = the brand name.' }] : []),
  { name: 'images',     label: 'Photos',      type: 'images', hint: 'The first photo is the brand’s tile; the others show when the brand is opened. Square photos fit best. Without photos, the tile shows the brand’s name.' },
  { name: 'tagline',    label: 'Tagline',     type: 'text', fr: true },
  { name: 'body',       label: 'Description', type: 'paragraphs', fr: true },
  ...(lines ? [{ name: 'lines', label: 'Brands in this category', type: 'lines', fr: true, hint: 'One per line: Brand — what it is for. French: the same lines, in the same order.' }] : []),
]

const brandRows = (brands, french) => brands.map(b => {
  const f = french[b.slug] || {}
  return {
    slug: b.slug,
    data: {
      name: b.name, name_fr: f.name || '',
      short_name: b.shortName || '',
      images: b.images || [],
      tagline: b.tagline || '', tagline_fr: f.tagline || '',
      body: joinParas(b.body), body_fr: joinParas(f.body),
      lines: (b.lines || []).map(l => `${l.name} — ${l.focus}`).join('\n'),
      lines_fr: (b.lines || []).map((l, i) => f.lines?.[i] ? `${l.name} — ${f.lines[i]}` : '').filter(Boolean).join('\n'),
    },
  }
})

/* An article's text: paragraphs with a blank line between them; a
   paragraph starting "## " is a heading; one like "[Book now](/medispa)"
   is a button. */
const articleText = blocks => (blocks || []).map(b =>
  b.type === 'heading' ? `## ${b.text}` : b.type === 'cta' ? `[${b.text}](${b.href})` : b.text).join('\n\n')

export const siteLists = {
  haircare: {
    label: 'Haircare', page: '/haircare', itemName: 'brand',
    fields: brandFields({ nameFr: true, lines: true }),
    fallback: brandRows(haircareBrands, haircareBrandsFrench),
  },
  skincare: {
    label: 'Skincare', page: '/skincare', itemName: 'brand',
    fields: brandFields({ shortName: true }),
    fallback: brandRows(skincareBrands, skincareBrandsFrench),
  },
  bathbody: {
    label: 'Bath & Body', page: '/bath-body', itemName: 'brand',
    fields: brandFields(),
    fallback: brandRows(bathBodyBrands, bathBodyBrandsFrench),
  },
  bathbody_accessories: {
    label: 'Bath & Body Accessories', page: '/bath-body', itemName: 'accessory',
    fields: brandFields(),
    fallback: brandRows(bathBodyAccessories, bathBodyBrandsFrench),
  },
  team: {
    label: 'Team Profiles', page: '/team', itemName: 'profile',
    fields: [
      { name: 'name',      label: 'Name',  type: 'text', required: true },
      { name: 'title',     label: 'Role',  type: 'text', fr: true },
      { name: 'image',     label: 'Photo', type: 'image', hint: 'A portrait photo fits best.' },
      { name: 'image_alt', label: 'What the photo shows', type: 'text', fr: true, hint: 'Read aloud to visitors who can’t see it.' },
      { name: 'bio',       label: 'Story', type: 'paragraphs', fr: true },
      { name: 'quote',     label: 'Quote', type: 'textarea', fr: true },
    ],
    fallback: teamMembers.map(m => {
      const f = teamMemberTranslations[m.name] || {}
      return {
        slug: m.name.toLowerCase(),
        data: {
          name: m.name, title: m.title, title_fr: f.title || '', image: m.image,
          image_alt: m.imageAlt || '', image_alt_fr: f.imageAlt || '',
          bio: m.bio, bio_fr: f.bio || '', quote: m.quote || '', quote_fr: f.quote || '',
        },
      }
    }),
  },
  spa_faq: {
    label: 'Spa FAQ', page: '/spa#faq', itemName: 'question',
    fields: [
      { name: 'q', label: 'Question', type: 'text', required: true, fr: true },
      { name: 'a', label: 'Answer',   type: 'textarea', fr: true },
    ],
    fallback: faqItems.map((f, i) => ({ slug: `faq-${i + 1}`, data: { q: f.q, q_fr: '', a: f.a, a_fr: '' } })),
  },
  events: {
    label: 'Events', page: '/blog', itemName: 'event',
    fields: [
      { name: 'title',    label: 'Event name', type: 'text', required: true, fr: true },
      { name: 'when',     label: 'When', type: 'text', fr: true, hint: 'e.g. 28 November 2026, 5–8 pm' },
      { name: 'where',    label: 'Where', type: 'text', fr: true, hint: 'Leave blank when it is at the spa.' },
      { name: 'detail',   label: 'Details', type: 'textarea', fr: true },
      { name: 'cta_text', label: 'Button text', type: 'text', fr: true, hint: 'Leave blank for no button.' },
      { name: 'cta_href', label: 'Button link', type: 'url', hint: 'A page (/spa), a website, or tel:+12509928084' },
    ],
    fallback: events.map(e => ({ slug: String(e.id), data: { title: e.title, when: e.when, where: e.where || '', detail: e.detail, cta_text: e.cta?.text || '', cta_href: e.cta?.href || '' } })),
  },
  daily_promos: {
    label: 'Promo of the Day', page: '/blog', itemName: 'promo graphic',
    fields: [
      { name: 'image', label: 'Graphic', type: 'image', required: true, hint: 'One promo shows each day, taking turns. With none, the section is hidden.' },
      { name: 'alt',   label: 'What the graphic says', type: 'textarea', fr: true, hint: 'Read aloud to visitors who can’t see it.' },
    ],
    fallback: dailyPromos.map(p => ({ slug: String(p.id), data: { image: p.image, width: p.width, height: p.height, alt: p.alt?.en || '', alt_fr: p.alt?.fr || '' } })),
  },
  articles: {
    label: 'Articles', page: '/blog', itemName: 'article',
    fields: [
      { name: 'title',     label: 'Title', type: 'text', required: true, fr: true },
      { name: 'category',  label: 'Category', type: 'text', fr: true, hint: 'Articles are filtered by category, e.g. MediSpa, Skincare, Wellness.' },
      { name: 'image',     label: 'Photo', type: 'image' },
      { name: 'featured',  label: 'Feature at the top of the articles', type: 'checkbox' },
      { name: 'date',      label: 'Date', type: 'text', fr: true, hint: 'As it should read, e.g. May 20, 2026' },
      { name: 'read_time', label: 'Reading time', type: 'text', fr: true, hint: 'e.g. 4 min read' },
      { name: 'author',    label: 'Author', type: 'text', fr: true },
      { name: 'excerpt',   label: 'Summary', type: 'textarea', fr: true },
      { name: 'body',      label: 'Article', type: 'paragraphs', fr: true, hint: 'A blank line between paragraphs. Start a paragraph with ## to make it a heading. A paragraph like [Book now](/medispa) becomes a button.' },
    ],
    fallback: blogPosts.map(p => {
      const f = blogTranslations[p.id] || {}
      return {
        slug: p.slug,
        data: {
          title: p.title, title_fr: f.title || '',
          category: p.category, category_fr: f.category || blogCategoryTranslations[p.category] || '',
          image: p.image, featured: Boolean(p.featured),
          date: p.date, date_fr: f.date || '', read_time: p.readTime, read_time_fr: f.readTime || '',
          author: p.author, author_fr: f.author || '',
          excerpt: p.excerpt, excerpt_fr: f.excerpt || '',
          body: articleText(p.body), body_fr: articleText(f.body),
        },
      }
    }),
  },
}

/* ── Reading the fields on the site ── */

// The value in the visitor's language: the French twin when there is one.
export const pick = (data, name, french) => (french && data[`${name}_fr`]?.trim()) || data[name] || ''

export const paragraphs = text => (text || '').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
export const lineList   = text => (text || '').split('\n').map(l => l.trim()).filter(Boolean)

// "Nioxin — thinning hair" → { name: 'Nioxin', focus: 'thinning hair' }
export const splitLine = line => {
  const m = line.match(/^(.*?)\s+[—–-]\s+(.*)$/)
  return m ? { name: m[1].trim(), focus: m[2].trim() } : { name: line.trim(), focus: '' }
}

// An article's text as blocks: paragraph, heading, cta.
export const articleBlocks = text => paragraphs(text).map(p => {
  if (p.startsWith('## ')) return { type: 'heading', text: p.slice(3).trim() }
  const button = p.match(/^\[(.+)\]\((\S+)\)$/)
  if (button) return { type: 'cta', text: button[1], href: button[2] }
  return { type: 'paragraph', text: p }
})
