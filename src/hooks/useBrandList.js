import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import useSiteList from './useSiteList'
import { pick, paragraphs, lineList, splitLine } from '../data/siteLists'

/* The brands of a Haircare, Skincare or Bath & Body list, shaped for
   <BrandTile> and <BrandModal>: each { brand, copy }, where `brand` has
   slug, images and lines, and `copy` is its text in the visitor's
   language. null while the list loads. */
export default function useBrandList(list) {
  const items = useSiteList(list)
  const { i18n } = useTranslation()
  const french = i18n.language.startsWith('fr')

  return useMemo(() => items && items.map(({ slug, data }) => {
    const lines = lineList(data.lines).map(splitLine)
    const linesFr = lineList(data.lines_fr).map(splitLine)
    return {
      brand: { slug, images: data.images || [], lines: lines.length ? lines : undefined },
      copy: {
        name:      pick(data, 'name', french),
        shortName: data.short_name || '',
        tagline:   pick(data, 'tagline', french),
        body:      paragraphs(pick(data, 'body', french)),
        lines:     lines.map((l, i) => (french && linesFr[i]?.focus) || l.focus),
      },
    }
  }), [items, french])
}
