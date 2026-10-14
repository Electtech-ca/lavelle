import AdminText from './AdminText'
import { intro } from './adminUi'

/* ──────────────────────────────────────────────────────────────
   Admin ▸ Contact & Hours — the address, phone number, opening hours
   and social links. They are page text (site_text) written once: the
   footer, brand pages, gift certificates and every "Call …" button
   read them from here.
   ────────────────────────────────────────────────────────────── */

const LABELS = {
  'contact.phone':        'Phone number',
  'contact.street':       'Street address',
  'contact.area':         'Town line (under the street in the footer)',
  'contact.mapAddress':   'Address for map links (Directions, Plan Your Visit)',
  'contact.hoursSummary': 'Opening hours, in a sentence (brand pages: “Open …”)',
  'footer.hours.monSat':  'Footer hours — first line, days',
  'footer.hours.open':    'Footer hours — first line, times',
  'footer.hours.sun':     'Footer hours — second line, days',
  'footer.hours.closed':  'Footer hours — second line, times',
  'contact.instagram':    'Instagram page (address)',
  'contact.facebook':     'Facebook page (address)',
}

export default function AdminContact() {
  return (
    <AdminText title="Contact & Hours" only={Object.keys(LABELS)} labels={LABELS}>
      <p style={intro}>
        The address, phone number, opening hours and social links, written once for the whole site:
        the footer, the brand pages, gift certificates and every “Call …” button use them.
        Calls dial the phone number as written here.
      </p>
    </AdminText>
  )
}
