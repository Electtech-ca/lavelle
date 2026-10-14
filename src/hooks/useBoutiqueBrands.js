import { useMemo } from 'react'
import { boutiqueBrands, clothingTypes } from '../data/boutiqueBrands'
import { boutiqueBrandsFrench } from '../data/boutiqueBrandsTranslations'
import useSiteRows from './useSiteRows'

// A write-up is stored as one text, paragraphs separated by a blank line.
export const paragraphs = text => (text || '').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)

const COPY_IN_CODE = boutiqueBrands.map(b => ({ ...b, fr: boutiqueBrandsFrench[b.slug] || {} }))

/* The brands on the Boutique page, in their order. They come from the
   boutique_brands table, which the admin's Boutique Brands page edits;
   null while it loads. Each is shaped like those in boutiqueBrands.js,
   plus `fr`: the French tagline and body (empty where there is none). */
export default function useBoutiqueBrands() {
  const rows = useSiteRows('boutique_brands')

  return useMemo(() => {
    if (rows === undefined) return null
    if (rows === null) return COPY_IN_CODE
    return rows.map(row => ({
      slug:    row.slug,
      name:    row.name,
      types:   clothingTypes.filter(t => (row.types || []).includes(t)),
      images:  row.images || [],
      tagline: row.tagline,
      body:    paragraphs(row.body),
      fr:      { tagline: row.tagline_fr, body: paragraphs(row.body_fr) },
    }))
  }, [rows])
}
