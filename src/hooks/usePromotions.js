import { useMemo } from 'react'
import { promotions, currentPromotions } from '../data/promotionsData'
import { promotionTranslations } from '../data/promotionTranslations'
import useSiteRows from './useSiteRows'

const COPY_IN_CODE = promotions.map(p => {
  const [title, value, expiry, description] = promotionTranslations[p.id] || []
  return { ...p, fr: { title, value, expiry, description } }
})

/* The promotions running today, for Current Promotions on Giftware and
   What's Happening. They come from the promotions table, which the admin
   edits; null while it loads. Each is shaped like those in
   promotionsData.js, plus `fr`: the French title, value, expiry and
   description (empty where there is no translation). */
export default function usePromotions() {
  const rows = useSiteRows('promotions')

  return useMemo(() => {
    if (rows === undefined) return null
    const list = rows === null ? COPY_IN_CODE : rows.map(row => ({
      id:          row.id,
      title:       row.title,
      value:       row.value,
      expiry:      row.expiry,
      description: row.description,
      until:       row.until,
      image:       row.image ? { src: row.image, width: row.image_width ?? undefined, height: row.image_height ?? undefined } : null,
      fr:          { title: row.title_fr, value: row.value_fr, expiry: row.expiry_fr, description: row.description_fr },
    }))
    return currentPromotions(new Date(), list)
  }, [rows])
}
