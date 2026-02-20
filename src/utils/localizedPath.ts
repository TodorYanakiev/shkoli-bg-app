import {
  defaultLanguage,
  getLanguageFromPathname,
  type LanguageCode,
} from './language'

const ensureLeadingSlash = (pathname: string) =>
  pathname.startsWith('/') ? pathname : `/${pathname}`

const removeTrailingSlash = (pathname: string) =>
  pathname !== '/' && pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname

export const stripLocalePrefix = (pathname: string): string => {
  const normalizedPathname = removeTrailingSlash(ensureLeadingSlash(pathname))
  const detectedLocale = getLanguageFromPathname(normalizedPathname)

  if (!detectedLocale) {
    return normalizedPathname
  }

  const withoutLocale = normalizedPathname.replace(
    new RegExp(`^/${detectedLocale}(?=/|$)`),
    '',
  )

  return withoutLocale === '' ? '/' : withoutLocale
}

export const toLocalizedPath = (
  pathname: string,
  locale: LanguageCode = defaultLanguage,
) => {
  const normalizedPathname = stripLocalePrefix(pathname)
  return normalizedPathname === '/'
    ? `/${locale}`
    : `/${locale}${normalizedPathname}`
}

