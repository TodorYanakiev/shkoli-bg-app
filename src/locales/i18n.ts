import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enCommon from './en/common.json'
import bgCommon from './bg/common.json'

const resources = {
  en: { common: enCommon },
  bg: { common: bgCommon },
} as const

const supportedLanguages = ['bg', 'en'] as const

const getInitialLanguage = () => {
  if (typeof navigator === 'undefined') return 'bg'
  const candidates =
    navigator.languages && navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language]

  for (const candidate of candidates) {
    const normalized = candidate.toLowerCase()
    if (normalized.startsWith('bg')) return 'bg'
    if (normalized.startsWith('en')) return 'en'
  }

  return 'bg'
}

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: 'en',
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
i18n.on('languageChanged', applyDocumentLanguage)

export default i18n
