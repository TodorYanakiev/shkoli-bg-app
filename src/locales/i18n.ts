import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enCommon from './en/common.json'
import bgCommon from './bg/common.json'
import {
  defaultLanguage,
  getInitialLanguage,
  persistLanguage,
  supportedLanguages,
} from '../utils/language'

const resources = {
  en: { common: enCommon },
  bg: { common: bgCommon },
} as const

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: defaultLanguage,
  supportedLngs: supportedLanguages,
  nonExplicitSupportedLngs: true,
  defaultNS: 'common',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
})

const applyDocumentLanguage = (language: string) => {
  if (typeof document === 'undefined') return
  document.documentElement.lang = language
}

applyDocumentLanguage(i18n.language)
i18n.on('languageChanged', (language) => {
  applyDocumentLanguage(language)
  persistLanguage(language)
})

export default i18n
