import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import fr from './fr.json'

/* Keys are flat ("nav.home"), so dots and colons in them are plain
   characters. The admin's text changes are added to these resources at
   run time (lib/siteContent.js); bindI18nStore re-renders the pages when
   they arrive. A "$t(contact.phone)" in a string is replaced by that key's
   text, so the address, phone and hours are written once. */
i18n
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, fr: { translation: fr } },
    lng: localStorage.getItem('lavelle-lang') || 'en',
    supportedLngs: ['en', 'fr'],
    fallbackLng: 'en',
    load: 'languageOnly',
    keySeparator: false,
    nsSeparator: false,
    interpolation: { escapeValue: false },
    react: { bindI18nStore: 'added' },
  })

export default i18n
