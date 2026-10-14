import { useMemo } from 'react'
import { siteLists } from '../data/siteLists'
import useSiteRows from './useSiteRows'

/* The shown items of one of the admin's lists (data/siteLists.js), in
   their order, each { slug, data }. They come from the site_items table;
   null while it loads, and the copy in code when it can't be read. */
export default function useSiteList(list) {
  const rows = useSiteRows('site_items')

  return useMemo(() => {
    if (rows === undefined) return null
    if (rows === null) return siteLists[list].fallback
    return rows.filter(r => r.list === list).map(r => ({ slug: r.slug, data: r.data || {} }))
  }, [rows, list])
}
