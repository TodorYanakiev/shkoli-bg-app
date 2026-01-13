const LANGUAGE_STORAGE_KEY = 'education-nearby-language'

export const supportedLanguages = ['bg', 'en'] as const
export type LanguageCode = (typeof supportedLanguages)[number]

export const defaultLanguage: LanguageCode = 'bg'

const isBrowser = () => typeof window !== 'undefined'

export const isSupportedLanguage = (
  value: string | null | undefined,
): value is LanguageCode => {
  if (!value) return false
  return supportedLanguages.includes(value as LanguageCode)
}

export const getSavedLanguage = (): LanguageCode | null => {
  if (!isBrowser()) return null
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  return isSupportedLanguage(stored) ? stored : null
}

export const getInitialLanguage = (): LanguageCode =>
  getSavedLanguage() ?? defaultLanguage

export const persistLanguage = (language: string) => {
  if (!isBrowser()) return
  if (!isSupportedLanguage(language)) return
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
}
