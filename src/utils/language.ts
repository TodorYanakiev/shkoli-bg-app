const LANGUAGE_STORAGE_KEY = 'education-nearby-language'

export const supportedLanguages = ['bg', 'en'] as const
export type LanguageCode = (typeof supportedLanguages)[number]

export const defaultLanguage: LanguageCode = 'bg'
const LOCALE_PATH_PATTERN = /^\/([a-z]{2})(?=\/|$)/i

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

export const getLanguageFromPathname = (
  pathname: string,
): LanguageCode | null => {
  const match = pathname.match(LOCALE_PATH_PATTERN)
  if (!match) return null
  return isSupportedLanguage(match[1]) ? match[1] : null
}

const getLanguageFromCurrentPath = (): LanguageCode | null => {
  if (!isBrowser()) return null
  return getLanguageFromPathname(window.location.pathname)
}

export const getPreferredLanguage = (): LanguageCode =>
  getLanguageFromCurrentPath() ?? getSavedLanguage() ?? defaultLanguage

export const getInitialLanguage = (): LanguageCode => getPreferredLanguage()

export const persistLanguage = (language: string) => {
  if (!isBrowser()) return
  if (!isSupportedLanguage(language)) return
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
}
