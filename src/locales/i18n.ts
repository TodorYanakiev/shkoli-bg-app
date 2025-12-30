import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enCommon from './en/common.json'
import bgCommon from './bg/common.json'

const resources = {
  en: { common: enCommon },
  bg: { common: bgCommon },
} as const

i18n.use(initReactI18next).init({
  resources,
  lng: 'bg',
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
})

export default i18n
