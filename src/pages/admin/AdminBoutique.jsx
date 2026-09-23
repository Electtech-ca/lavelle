import { useEffect, useMemo, useState } from 'react'
import AdminLayout from './AdminLayout'
import { supabase } from '../../lib/supabase'
import { boutiqueBrands, clothingTypes, outerwearTypes } from '../../data/boutiqueBrands'

/* ──────────────────────────────────────────────────────────────
   Admin ▸ Boutique Brands — which clothing-type filters each brand
   appears under on the public Boutique page.

   Tags live in public.boutique_brand_tags (one row per brand slug);
   brand names, write-ups and photos stay in src/data/boutiqueBrands.js.
   A brand with no saved row falls back to its built-in tags, so the
   page always shows something sensible before the first save.
   ────────────────────────────────────────────────────────────── */

const LABELS = { tops: 'Tops', bottoms: 'Bottoms', jackets: 'Jackets', cardigans: 'Cardigans', dresses: 'Dresses', pjs: 'PJs' }
const GROUPS = [
  { label: null,        types: ['tops', 'bottoms'] },
  { label: 'Outerwear', types: outerwearTypes },
  { label: null,        types: ['dresses', 'pjs'] },
]
const NAVY = '#2E3350'

const builtIn = Object.fromEntries(boutiqueBrands.map(b => [b.slug, b.types]))
const ordered = types => clothingTypes.filter(t => types.includes(t))
const same = (a, b) => a.length === b.length && a.every(t => b.includes(t))

export default function AdminBoutique() {
  const [saved,   setSaved]   = useState(builtIn)   // what the database holds
  const [draft,   setDraft]   = useState(builtIn)   // what is on screen
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [notice,  setNotice]  = useState(null)      // { ok, text }

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase.from('boutique_brand_tags').select('slug, types')
      .then(({ data, error }) => {
        if (error) { setNotice({ ok: false, text: 'Could not load tags: ' + error.message }); return }
        const fromDb = { ...builtIn, ...Object.fromEntries((data || []).map(r => [r.slug, ordered(r.types)])) }
        setSaved(fromDb); setDraft(fromDb)
      })
      .catch(err => setNotice({ ok: false, text: 'Could not load tags: ' + err.message }))
      .finally(() => setLoading(false))
  }, [])

  const changed = useMemo(
    () => boutiqueBrands.filter(b => !same(draft[b.slug] || [], saved[b.slug] || [])).map(b => b.slug),
    [draft, saved],
  )

  // How many brands each public filter will show, from what is on screen.
  const counts = useMemo(() => {
    const n = type => boutiqueBrands.filter(b => (draft[b.slug] || []).includes(type)).length
    return {
      tops: n('tops'), bottoms: n('bottoms'), dresses: n('dresses'), pjs: n('pjs'),
      jackets: n('jackets'), cardigans: n('cardigans'),
      outerwear: boutiqueBrands.filter(b => (draft[b.slug] || []).some(t => outerwearTypes.includes(t))).length,
    }
  }, [draft])

  function toggle(slug, type) {
    setNotice(null)
    setDraft(d => {
      const cur = d[slug] || []
      return { ...d, [slug]: ordered(cur.includes(type) ? cur.filter(t => t !== type) : [...cur, type]) }
    })
  }

  async function save() {
    if (!supabase || !changed.length) return
    setSaving(true); setNotice(null)
    const rows = changed.map(slug => ({ slug, types: draft[slug], updated_at: new Date().toISOString() }))
    const { error } = await supabase.from('boutique_brand_tags').upsert(rows, { onConflict: 'slug' })
    setSaving(false)
    if (error) { setNotice({ ok: false, text: 'Save failed: ' + error.message }); return }
    setSaved(s => ({ ...s, ...Object.fromEntries(rows.map(r => [r.slug, r.types])) }))
    setNotice({ ok: true, text: `Saved. The Boutique page now uses these tags (${rows.length} brand${rows.length > 1 ? 's' : ''} updated).` })
  }

  const chip = (on) => ({
    fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600, padding: '6px 12px',
    borderRadius: 'var(--radius-full)', cursor: 'pointer', transition: 'all 0.15s ease',
    border: `1px solid ${on ? NAVY : 'var(--lavelle-cream)'}`,
    background: on ? NAVY : 'var(--lavelle-ivory)', color: on ? '#F6F5ED' : 'var(--lavelle-gray-mid)',
  })
  const stat = (label, n) => (
    <div key={label} style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-sm) var(--space-md)', boxShadow: 'var(--shadow-card)', border: n === 0 ? '1px solid rgba(192,57,43,0.4)' : '1px solid transparent' }}>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 300, lineHeight: 1, color: n === 0 ? '#C0392B' : 'var(--lavelle-plum-deep)' }}>{n}</p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-micro)', color: 'var(--lavelle-gray-mid)', marginTop: '2px' }}>{label}</p>
    </div>
  )

  return (
    <AdminLayout title="Boutique Brands">
      {!supabase && (
        <div style={{ background: 'rgba(228,62,45,0.1)', border: '1px solid rgba(228,62,45,0.35)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-md) var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: '#b83020' }}>
            <strong>Dev mode:</strong> no database is connected, so changes here cannot be saved.
          </p>
        </div>
      )}

      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: 'var(--lavelle-charcoal)', lineHeight: 1.7, maxWidth: '760px', marginBottom: 'var(--space-lg)' }}>
        Choose which clothing-type filters each brand appears under on the public Boutique page.
        Outerwear shows every brand tagged Jackets or Cardigans. A filter with no brands tells
        visitors to ask in store.
      </p>

      {/* Brands per public filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)' }}>
        {stat('Tops', counts.tops)}
        {stat('Bottoms', counts.bottoms)}
        {stat(`Outerwear (${counts.jackets} jackets · ${counts.cardigans} cardigans)`, counts.outerwear)}
        {stat('Dresses', counts.dresses)}
        {stat('PJs', counts.pjs)}
      </div>

      {loading ? (
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--lavelle-gray-mid)', textAlign: 'center', padding: 'var(--space-3xl)' }}>Loading brands…</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(340px, 100%), 1fr))', gap: 'var(--space-lg)', paddingBottom: '96px' }}>
          {boutiqueBrands.map(brand => {
            const types = draft[brand.slug] || []
            const dirty = changed.includes(brand.slug)
            return (
              <div key={brand.slug} style={{ background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)', padding: 'var(--space-lg)', display: 'flex', gap: 'var(--space-md)', borderTop: `4px solid ${dirty ? 'var(--lavelle-gold-champagne)' : 'transparent'}` }}>
                {brand.images[0]
                  ? <img src={brand.images[0]} alt="" style={{ width: '64px', height: '86px', objectFit: 'cover', objectPosition: 'center top', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
                  : <div style={{ width: '64px', height: '86px', borderRadius: 'var(--radius-md)', flexShrink: 0, background: NAVY, color: '#E9B0B9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✦</div>}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-sm)', alignItems: 'baseline', marginBottom: 'var(--space-sm)' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 400, color: 'var(--lavelle-plum-deep)' }}>{brand.name}</h3>
                    {dirty && <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', fontWeight: 700, color: 'var(--lavelle-gold-deep)', whiteSpace: 'nowrap' }}>Unsaved</span>}
                  </div>
                  {GROUPS.map((g, gi) => (
                    <div key={gi} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      {g.label && <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--lavelle-gray-mid)', marginRight: '2px' }}>{g.label}:</span>}
                      {g.types.map(type => {
                        const on = types.includes(type)
                        return (
                          <button key={type} type="button" aria-pressed={on} onClick={() => toggle(brand.slug, type)} style={chip(on)}>
                            {on ? '✓ ' : ''}{LABELS[type]}
                          </button>
                        )
                      })}
                    </div>
                  ))}
                  {types.length === 0 && (
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: '#C0392B', marginTop: '4px' }}>No tags — this brand only shows under "All".</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Save bar */}
      <div style={{ position: 'sticky', bottom: 'var(--space-md)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-md)', background: 'var(--lavelle-white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-float, var(--shadow-card))', padding: 'var(--space-md) var(--space-lg)' }}>
        <p role="status" style={{ flex: 1, minWidth: '220px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-small)', color: notice ? (notice.ok ? '#2E7D5E' : '#C0392B') : 'var(--lavelle-gray-mid)' }}>
          {notice ? notice.text : changed.length ? `${changed.length} brand${changed.length > 1 ? 's' : ''} with unsaved changes` : 'All changes saved'}
        </p>
        <button type="button" disabled={!changed.length || saving} onClick={() => { setDraft(saved); setNotice(null) }}
          style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', padding: '9px 18px', borderRadius: 'var(--radius-full)', border: '1px solid var(--lavelle-cream)', background: 'none', color: 'var(--lavelle-gray-mid)', cursor: changed.length ? 'pointer' : 'default', opacity: changed.length ? 1 : 0.5 }}>
          Discard
        </button>
        <button type="button" className="btn-primary" disabled={!changed.length || saving || !supabase} onClick={save}
          style={{ fontSize: '0.8rem', opacity: changed.length && !saving ? 1 : 0.5 }}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </AdminLayout>
  )
}
