import {
  extractLastmodFromEntity,
  isoToday,
  loadSeoEnv,
  parseNumericId,
  readSeoContentMap,
  type SeoContentEntry,
  type SeoContentMap,
  writeSeoContentMap,
} from './seo.shared'

type PageResponse<T> = {
  content?: T[]
  totalPages?: number
  last?: boolean
}

const PAGE_SIZE = 200
const MAX_PAGE_GUARD = 200
const ALLOW_CACHE_ON_SYNC_FAILURE =
  (process.env.SEO_ALLOW_CACHE_ON_SYNC_FAILURE ?? 'true')
    .trim()
    .toLowerCase() !== 'false'

const toEntries = (
  records: Array<Record<string, unknown>>,
  existing: SeoContentEntry[],
): SeoContentEntry[] => {
  const previousById = new Map(existing.map((entry) => [entry.id, entry.lastmod]))
  const nextById = new Map<number, SeoContentEntry>()
  const fallbackDate = isoToday()

  for (const record of records) {
    const id = parseNumericId(record.id)
    if (!id) {
      continue
    }

    const lastmod =
      extractLastmodFromEntity(record) ?? previousById.get(id) ?? fallbackDate

    nextById.set(id, {
      id,
      lastmod,
    })
  }

  return Array.from(nextById.values()).sort((left, right) => left.id - right.id)
}

const fetchPage = async (
  baseUrl: string,
  path: string,
  page: number,
): Promise<PageResponse<Record<string, unknown>>> => {
  const url = new URL(path, `${baseUrl}/`)
  url.searchParams.set('page', page.toString())
  url.searchParams.set('size', PAGE_SIZE.toString())

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} (${url.toString()})`)
  }

  return (await response.json()) as PageResponse<Record<string, unknown>>
}

const fetchAll = async (
  baseUrl: string,
  path: string,
): Promise<Array<Record<string, unknown>>> => {
  const records: Array<Record<string, unknown>> = []

  let page = 0
  let totalPages = 1

  while (page < totalPages && page < MAX_PAGE_GUARD) {
    const payload = await fetchPage(baseUrl, path, page)
    const content = payload.content ?? []

    records.push(...content)

    if (typeof payload.totalPages === 'number') {
      totalPages = Math.max(payload.totalPages, 1)
    } else if (payload.last || content.length < PAGE_SIZE) {
      break
    }

    page += 1
  }

  return records
}

const tryFetchEntries = async (
  label: 'courses' | 'lyceums',
  baseUrl: string,
  endpoint: string,
  previousEntries: SeoContentEntry[],
) => {
  try {
    const records = await fetchAll(baseUrl, endpoint)
    const entries = toEntries(records, previousEntries)

    console.log(`[seo:sync-content] Synced ${label}: ${entries.length} entries.`)

    return {
      entries,
      fromApi: true,
      usedCacheFallback: false,
    }
  } catch (error) {
    if (ALLOW_CACHE_ON_SYNC_FAILURE) {
      console.warn(
        `[seo:sync-content] Failed to sync ${label} from API. Reusing previous map.`,
        error,
      )

      return {
        entries: previousEntries,
        fromApi: false,
        usedCacheFallback: true,
      }
    }

    console.warn(
      `[seo:sync-content] Failed to sync ${label} from API. Using empty list because SEO_ALLOW_CACHE_ON_SYNC_FAILURE=false.`,
      error,
    )

    return {
      entries: [],
      fromApi: false,
      usedCacheFallback: false,
    }
  }
}

const main = async () => {
  const env = loadSeoEnv()
  const previousMap = readSeoContentMap()

  console.log(
    `[seo:sync-content] Using API base URL: ${env.apiBaseUrl}`,
  )

  const [coursesResult, lyceumsResult] = await Promise.all([
    tryFetchEntries(
      'courses',
      env.apiBaseUrl,
      '/api/v1/courses/filter',
      previousMap.courses,
    ),
    tryFetchEntries(
      'lyceums',
      env.apiBaseUrl,
      '/api/v1/lyceums/filter',
      previousMap.lyceums,
    ),
  ])

  const nextMap: SeoContentMap = {
    generatedAt: new Date().toISOString(),
    courses: coursesResult.entries,
    lyceums: lyceumsResult.entries,
  }

  writeSeoContentMap(nextMap)

  const sourceLabel =
    coursesResult.fromApi && lyceumsResult.fromApi
      ? 'API'
      : coursesResult.usedCacheFallback || lyceumsResult.usedCacheFallback
        ? coursesResult.fromApi || lyceumsResult.fromApi
          ? 'mixed API/cache'
          : 'cache'
        : coursesResult.fromApi || lyceumsResult.fromApi
          ? 'mixed API/empty'
          : 'empty'

  console.log(
    `[seo:sync-content] Wrote content map (${sourceLabel}) with ${nextMap.courses.length} courses and ${nextMap.lyceums.length} lyceums.`,
  )
}

void main()
