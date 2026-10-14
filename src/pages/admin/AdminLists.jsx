import AdminItems from './AdminItems'

/* The admin pages built on AdminItems, one per menu entry. */

const BRAND_LISTS     = ['haircare', 'skincare', 'bathbody', 'bathbody_accessories']
const TEAM_LISTS      = ['team']
const HAPPENING_LISTS = ['articles', 'events', 'daily_promos']
const FAQ_LISTS       = ['spa_faq']

export function AdminBrands() {
  return (
    <AdminItems title="Product Brands" lists={BRAND_LISTS}>
      The brands on the Haircare, Skincare and Bath &amp; Body pages, in the order shown, with their photos and
      write-ups in English and French. Changes show on the site straight away. Boutique clothing brands are on
      Boutique Brands.
    </AdminItems>
  )
}

export function AdminTeam() {
  return (
    <AdminItems title="Team" lists={TEAM_LISTS}>
      The profiles on the Team page, in the order shown. The family story above them and the other wording on that
      page are on Page Text ▸ Team; its photos are on Photos.
    </AdminItems>
  )
}

export function AdminHappening() {
  return (
    <AdminItems title="What's Happening" lists={HAPPENING_LISTS}>
      The articles, events and promo of the day on the What’s Happening page. Current Promotions are on the
      Promotions page. An events list with nothing shown tells visitors that dates are coming soon.
    </AdminItems>
  )
}

export function AdminFaq() {
  return (
    <AdminItems title="Spa FAQ" lists={FAQ_LISTS}>
      The questions and answers on the Spa page’s FAQ tab, in the order shown.
    </AdminItems>
  )
}
