import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import bgCommon from './bg/common.json'
import {
  defaultLanguage,
  getInitialLanguage,
  isSupportedLanguage,
  persistLanguage,
  supportedLanguages,
  type LanguageCode,
} from '../utils/language'

type TranslationNamespace = 'common' | 'legal'
type TranslationBundle = Record<string, unknown>

const loadEnCommon = async (): Promise<TranslationBundle> => {
  const module = await import('./en/common.json')
  return module.default as TranslationBundle
}

const loadBgLegal = async (): Promise<TranslationBundle> => {
  const module = await import('./bg/legal.json')
  return module.default as TranslationBundle
}

const loadEnLegal = async (): Promise<TranslationBundle> => {
  const module = await import('./en/legal.json')
  return module.default as TranslationBundle
}

const namespaceLoaders: Record<
  LanguageCode,
  Record<TranslationNamespace, () => Promise<TranslationBundle>>
> = {
  bg: {
    common: async () => bgCommon as TranslationBundle,
    legal: loadBgLegal,
  },
  en: {
    common: loadEnCommon,
    legal: loadEnLegal,
  },
}

const toNamespaceKey = (language: LanguageCode, namespace: TranslationNamespace) =>
  `${language}:${namespace}`

const loadedNamespaces = new Set<string>([toNamespaceKey('bg', 'common')])

const toSupportedLanguage = (language: string): LanguageCode =>
  isSupportedLanguage(language) ? language : defaultLanguage

const loadNamespace = async (
  language: LanguageCode,
  namespace: TranslationNamespace,
) => {
  const cacheKey = toNamespaceKey(language, namespace)
  if (
    loadedNamespaces.has(cacheKey) ||
    i18n.hasResourceBundle(language, namespace)
  ) {
    loadedNamespaces.add(cacheKey)
    return
  }

  const bundle = await namespaceLoaders[language][namespace]()
  i18n.addResourceBundle(language, namespace, bundle, true, true)
  loadedNamespaces.add(cacheKey)
}

export const ensureI18nNamespaces = async (
  language: string,
  namespaces: readonly TranslationNamespace[],
) => {
  const resolvedLanguage = toSupportedLanguage(language)
  await Promise.all(
    namespaces.map((namespace) => loadNamespace(resolvedLanguage, namespace)),
  )
}

const applyDocumentLanguage = (language: string) => {
  if (typeof document === 'undefined') return
  document.documentElement.lang = language
}

const onLanguageChanged = (language: string) => {
  applyDocumentLanguage(language)
  persistLanguage(language)
}

const originalChangeLanguage = i18n.changeLanguage.bind(i18n)

i18n.changeLanguage = async (language, callback) => {
  if (typeof language === 'string' && isSupportedLanguage(language)) {
    await ensureI18nNamespaces(language, ['common'])
  }

  return originalChangeLanguage(language, callback)
}

export const i18nReady = i18n
  .use(initReactI18next)
  .init({
    resources: {
      bg: { common: bgCommon },
    },
    lng: defaultLanguage,
    fallbackLng: defaultLanguage,
    supportedLngs: supportedLanguages,
    nonExplicitSupportedLngs: true,
    defaultNS: 'common',
    ns: ['common', 'legal'],
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  })
  .then(async () => {
    i18n.on('languageChanged', onLanguageChanged)

    const initialLanguage = getInitialLanguage()
    await ensureI18nNamespaces(initialLanguage, ['common'])

    if (i18n.language !== initialLanguage) {
      await i18n.changeLanguage(initialLanguage)
      return
    }

    onLanguageChanged(initialLanguage)
  })
  .catch(() => {
    onLanguageChanged(defaultLanguage)
  })

export default i18n
