import { useMemo } from 'react'
import { serviceSections } from '../data/serviceSections'
import useSiteRows from './useSiteRows'

const COPY_IN_CODE = Object.fromEntries(serviceSections.map(s => [s.key, { items: s.items, fr: s.fr }]))

/* The Salon and Spa price lists by section key, each { items, fr } as
   <PriceList> takes them (`fr` indexed like `items`). They come from the
   services table, which the admin edits; null while it loads. */
export default function useServiceLists() {
  const rows = useSiteRows('services')

  return useMemo(() => {
    if (rows === undefined) return null
    if (rows === null) return COPY_IN_CODE

    const lists = Object.fromEntries(serviceSections.map(s => [s.key, { items: [], fr: [] }]))
    for (const row of rows) {
      const list = lists[row.subcategory]
      if (!list) continue
      list.items.push({ service: row.name, price: row.price })
      list.fr.push({ service: row.name_fr, price: row.price_fr })
    }
    return lists
  }, [rows])
}
