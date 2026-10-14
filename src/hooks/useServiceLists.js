import { useMemo } from 'react'
import { serviceSections } from '../data/serviceSections'
import useSiteRows from './useSiteRows'

const COPY_IN_CODE = Object.fromEntries(serviceSections.map(s => [s.key, { items: s.items, fr: s.fr }]))
const PAGE_OF = Object.fromEntries(serviceSections.map(s => [s.key, s.page]))

/* The Salon, Spa and MediSpa price lists by section key, each { items, fr }
   as <PriceList> takes them (`fr` indexed like `items`; MediSpa's items
   also have `series`). They come from the services table, which the admin
   edits; null while it loads. */
export default function useServiceLists() {
  const rows = useSiteRows('services')

  return useMemo(() => {
    if (rows === undefined) return null
    if (rows === null) return COPY_IN_CODE

    // A page with no rows at all yet (MediSpa before its prices were copied
    // in) keeps the copy in code.
    const pagesInDb = new Set(rows.map(r => r.category))
    const lists = Object.fromEntries(serviceSections.map(s =>
      [s.key, pagesInDb.has(s.page) ? { items: [], fr: [] } : COPY_IN_CODE[s.key]]))
    for (const row of rows) {
      const list = lists[row.subcategory]
      if (!list || !pagesInDb.has(PAGE_OF[row.subcategory])) continue   // never add to the copy in code
      list.items.push({ service: row.name, price: row.price, series: row.price_series || '' })
      list.fr.push({ service: row.name_fr, price: row.price_fr })
    }
    return lists
  }, [rows])
}
