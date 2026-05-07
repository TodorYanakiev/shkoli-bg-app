import { env } from './env'
import type { LanguageCode } from '../utils/language'
import { defaultLanguage, supportedLanguages } from '../utils/language'
import { stripLocalePrefix, toLocalizedPath } from '../utils/localizedPath'

export type SeoBreadcrumb = {
  label: string
  path: string
}

const normalizePathname = (pathname: string) => {
  const withLeadingSlash = pathname.startsWith('/') ? pathname : `/${pathname}`
  if (withLeadingSlash.length > 1 && withLeadingSlash.endsWith('/')) {
    return withLeadingSlash.slice(0, -1)
  }
  return withLeadingSlash
}

const normalizedSiteUrl = env.siteUrl.endsWith('/')
  ? env.siteUrl.slice(0, -1)
  : env.siteUrl

export const toAbsoluteUrl = (pathname: string) =>
  `${normalizedSiteUrl}${normalizePathname(pathname)}`

export const resolveCanonicalPath = (
  pathname: string,
  locale: LanguageCode,
) => {
  const withoutLocale = stripLocalePrefix(pathname)
  return toLocalizedPath(withoutLocale, locale)
}

const noindexPathPatterns = [
  /^\/auth(?:\/|$)/,
  /^\/admin(?:\/|$)/,
  /^\/profile(?:\/|$)/,
  /^\/login(?:\/|$)/,
  /^\/register(?:\/|$)/,
  /^\/shkoli\/new(?:\/|$)/,
  /^\/shkoli\/\d+\/edit(?:\/|$)/,
  /^\/lyceums\/\d+\/edit(?:\/|$)/,
  /^\/map(?:\/|$)/,
]

export const staticIndexablePaths = [
  '/shkoli',
  '/lyceums',
  '/about',
  '/help',
  '/cookies',
  '/privacy-policy',
  '/terms-and-conditions',
] as const

export const shouldNoindexRoute = (
  pathname: string,
  searchParams?: URLSearchParams,
) => {
  const withoutLocale = stripLocalePrefix(pathname)

  if (noindexPathPatterns.some((pattern) => pattern.test(withoutLocale))) {
    return true
  }

  if (withoutLocale === '/not-found') {
    return true
  }

  if (searchParams && Array.from(searchParams.keys()).length > 0) {
    return true
  }

  return false
}

export const getRobotsContent = (
  pathname: string,
  searchParams?: URLSearchParams,
  forceNoindex?: boolean,
) => {
  if (forceNoindex || shouldNoindexRoute(pathname, searchParams)) {
    return 'noindex,follow'
  }

  return 'index,follow'
}

export const getHreflangAlternates = (canonicalPathWithoutLocale: string) => {
  const normalizedPath = stripLocalePrefix(canonicalPathWithoutLocale)
  const entries = supportedLanguages.map((locale) => ({
    locale,
    href: toAbsoluteUrl(toLocalizedPath(normalizedPath, locale)),
  }))

  return [
    ...entries.map((entry) => ({
      hrefLang: entry.locale,
      href: entry.href,
    })),
    {
      hrefLang: 'x-default',
      href: entries.find((entry) => entry.locale === defaultLanguage)?.href ??
        entries[0].href,
    },
  ]
}

export const buildOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: env.siteName,
  url: normalizedSiteUrl,
  logo: toAbsoluteUrl(env.seoDefaultImagePath),
  sameAs: [
    'https://www.youtube.com/@shkolibg',
    'https://www.instagram.com/shkoli_bg',
    'https://www.tiktok.com/@shkoli.bg',
  ],
})

export const buildWebsiteSchema = (locale: LanguageCode) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: env.siteName,
  url: normalizedSiteUrl,
  inLanguage: locale,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${toAbsoluteUrl(toLocalizedPath('/shkoli', locale))}?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
})

export const buildBreadcrumbSchema = (
  locale: LanguageCode,
  breadcrumbs: SeoBreadcrumb[],
) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((breadcrumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: breadcrumb.label,
    item: toAbsoluteUrl(toLocalizedPath(breadcrumb.path, locale)),
  })),
})
