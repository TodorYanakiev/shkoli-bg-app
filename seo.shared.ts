import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs'
import { dirname, resolve } from 'node:path'

import { loadEnv } from 'vite'

import {
  defaultLanguage,
  supportedLanguages,
  type LanguageCode,
} from './src/utils/language'
import { toLocalizedPath } from './src/utils/localizedPath'

export type SeoContentEntry = {
  id: number
  lastmod: string
}

export type SeoContentMap = {
  generatedAt: string
  courses: SeoContentEntry[]
  lyceums: SeoContentEntry[]
}

export type SeoRouteEntry = {
  path: string
  locale: LanguageCode
  lastmod: string
  source: 'static' | 'course' | 'lyceum'
}

export type SeoEnv = {
  siteUrl: string
  apiBaseUrl: string
  defaultLocale: LanguageCode
}

export const PUBLIC_DIR = resolve(process.cwd(), 'public')
export const DIST_DIR = resolve(process.cwd(), 'dist')
export const SEO_CONTENT_MAP_PATH = resolve(PUBLIC_DIR, 'seo-content-map.json')
export const SEO_ROUTE_AUDIT_PATH = resolve(PUBLIC_DIR, 'seo-route-audit.json')
export const ROBOTS_PATH = resolve(PUBLIC_DIR, 'robots.txt')
export const HTML_SITEMAP_PATH = resolve(PUBLIC_DIR, 'site-map.html')
export const SITEMAP_INDEX_PATH = resolve(PUBLIC_DIR, 'sitemap.xml')
export { supportedLanguages }

export const INDEXABLE_STATIC_PATHS: readonly string[] = [
  '/shkoli',
  '/lyceums',
  '/about',
  '/cookies',
  '/privacy-policy',
  '/terms-and-conditions',
]

export const BLOCKED_ROUTE_PATTERNS: readonly string[] = [
  '/:locale/auth/*',
  '/:locale/admin/*',
  '/:locale/profile/*',
  '/:locale/map',
  '/:locale/shkoli/new',
  '/:locale/shkoli/:id/edit',
  '/:locale/lyceums/:id/edit',
  '/:locale/not-found',
  '/:locale/login',
  '/:locale/register',
]

export const LEGACY_REDIRECTS: Record<string, string> = {
  '/': '/:locale/shkoli',
  '/shkoli': '/:locale/shkoli',
  '/lyceums': '/:locale/lyceums',
  '/about': '/:locale/about',
  '/cookies': '/:locale/cookies',
  '/privacy-policy': '/:locale/privacy-policy',
  '/terms-and-conditions': '/:locale/terms-and-conditions',
  '/map': '/:locale/map',
  '/login': '/:locale/auth/login',
  '/register': '/:locale/auth/register',
}

const DEFAULT_SITE_URL = 'https://shkoli.bg'
const DEFAULT_API_BASE_URL = 'http://localhost:8088'

const trimTrailingSlash = (value: string) =>
  value.endsWith('/') ? value.slice(0, -1) : value

const normalizeDate = (value: string) => {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString().slice(0, 10)
  }

  return parsed.toISOString().slice(0, 10)
}

export const isoToday = () => new Date().toISOString().slice(0, 10)

export const ensureDirectory = (filePath: string) => {
  const parentDirectory = dirname(filePath)
  if (!existsSync(parentDirectory)) {
    mkdirSync(parentDirectory, { recursive: true })
  }
}

export const readJsonFile = <T>(filePath: string): T | null => {
  if (!existsSync(filePath)) {
    return null
  }

  const raw = readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as T
}

export const writeJsonFile = (filePath: string, value: unknown) => {
  ensureDirectory(filePath)
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf-8')
}

export const writeTextFile = (filePath: string, value: string) => {
  ensureDirectory(filePath)
  writeFileSync(filePath, value, 'utf-8')
}

export const loadSeoEnv = (): SeoEnv => {
  const viteEnv = loadEnv('production', process.cwd(), '')
  const envValue = (key: string) => process.env[key] ?? viteEnv[key]

  const rawSiteUrl = envValue('VITE_SITE_URL') ?? DEFAULT_SITE_URL
  const rawApiBaseUrl = envValue('VITE_API_BASE_URL') ?? DEFAULT_API_BASE_URL
  const seoApiOrigin = envValue('SEO_API_ORIGIN') ?? DEFAULT_API_BASE_URL

  const defaultLocaleCandidate = envValue('SEO_DEFAULT_LOCALE')
  const resolvedDefaultLocale = supportedLanguages.includes(
    defaultLocaleCandidate as LanguageCode,
  )
    ? (defaultLocaleCandidate as LanguageCode)
    : defaultLanguage

  const siteUrl = trimTrailingSlash(rawSiteUrl)

  const apiBaseUrl = (() => {
    if (/^https?:\/\//i.test(rawApiBaseUrl)) {
      return trimTrailingSlash(rawApiBaseUrl)
    }

    return trimTrailingSlash(new URL(rawApiBaseUrl, seoApiOrigin).toString())
  })()

  return {
    siteUrl,
    apiBaseUrl,
    defaultLocale: resolvedDefaultLocale,
  }
}

export const readSeoContentMap = (): SeoContentMap => {
  const fallback: SeoContentMap = {
    generatedAt: new Date().toISOString(),
    courses: [],
    lyceums: [],
  }

  const parsed = readJsonFile<SeoContentMap>(SEO_CONTENT_MAP_PATH)

  if (!parsed) {
    return fallback
  }

  const normalizeEntries = (entries: SeoContentEntry[] | undefined) =>
    (entries ?? [])
      .filter((entry) => Number.isFinite(entry.id) && entry.id > 0)
      .map((entry) => ({
        id: Number(entry.id),
        lastmod: normalizeDate(entry.lastmod),
      }))
      .sort((left, right) => left.id - right.id)

  return {
    generatedAt: parsed.generatedAt ?? fallback.generatedAt,
    courses: normalizeEntries(parsed.courses),
    lyceums: normalizeEntries(parsed.lyceums),
  }
}

export const writeSeoContentMap = (map: SeoContentMap) => {
  const normalized: SeoContentMap = {
    generatedAt: map.generatedAt,
    courses: [...map.courses].sort((left, right) => left.id - right.id),
    lyceums: [...map.lyceums].sort((left, right) => left.id - right.id),
  }

  writeJsonFile(SEO_CONTENT_MAP_PATH, normalized)
}

export const buildIndexableRoutes = (
  contentMap: SeoContentMap,
): SeoRouteEntry[] => {
  const routes: SeoRouteEntry[] = []

  const generatedAtDate = normalizeDate(contentMap.generatedAt)

  for (const locale of supportedLanguages) {
    for (const path of INDEXABLE_STATIC_PATHS) {
      routes.push({
        locale,
        path: toLocalizedPath(path, locale),
        lastmod: generatedAtDate,
        source: 'static',
      })
    }

    for (const entry of contentMap.courses) {
      routes.push({
        locale,
        path: toLocalizedPath(`/shkoli/${entry.id}`, locale),
        lastmod: normalizeDate(entry.lastmod),
        source: 'course',
      })
    }

    for (const entry of contentMap.lyceums) {
      routes.push({
        locale,
        path: toLocalizedPath(`/lyceums/${entry.id}`, locale),
        lastmod: normalizeDate(entry.lastmod),
        source: 'lyceum',
      })
    }
  }

  return routes.sort((left, right) => {
    if (left.path === right.path) {
      return left.lastmod.localeCompare(right.lastmod)
    }

    return left.path.localeCompare(right.path)
  })
}

export const toAbsoluteUrl = (siteUrl: string, path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${trimTrailingSlash(siteUrl)}${normalizedPath}`
}

export const toRouteOutputPath = (baseDir: string, routePath: string) => {
  const normalizedPath = routePath.split('?')[0].split('#')[0]
  const withoutTrailingSlash =
    normalizedPath.length > 1 && normalizedPath.endsWith('/')
      ? normalizedPath.slice(0, -1)
      : normalizedPath

  if (withoutTrailingSlash === '/' || withoutTrailingSlash === '') {
    return resolve(baseDir, 'index.html')
  }

  const relativeRoutePath = withoutTrailingSlash.replace(/^\//, '')
  return resolve(baseDir, relativeRoutePath, 'index.html')
}

export const xmlEscape = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')

export const extractLastmodFromEntity = (
  entity: Record<string, unknown>,
): string | null => {
  const knownDateKeys = [
    'updatedAt',
    'lastUpdatedAt',
    'lastModifiedDate',
    'lastModifiedAt',
    'modifiedAt',
    'createdAt',
    'createdDate',
  ] as const

  for (const dateKey of knownDateKeys) {
    const rawValue = entity[dateKey]

    if (typeof rawValue !== 'string') {
      continue
    }

    const parsedDate = new Date(rawValue)
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.toISOString().slice(0, 10)
    }
  }

  return null
}

export const summarizeRoutes = (routes: SeoRouteEntry[]) => {
  const byLocale = Object.fromEntries(
    supportedLanguages.map((locale) => [locale, 0]),
  ) as Record<LanguageCode, number>
  const bySource: Record<SeoRouteEntry['source'], number> = {
    static: 0,
    course: 0,
    lyceum: 0,
  }

  for (const route of routes) {
    byLocale[route.locale] += 1
    bySource[route.source] += 1
  }

  return {
    total: routes.length,
    byLocale,
    bySource,
  }
}

export const parseNumericId = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return Math.trunc(value)
  }

  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10)
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed
    }
  }

  return null
}
