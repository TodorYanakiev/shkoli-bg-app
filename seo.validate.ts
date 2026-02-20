import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import {
  BLOCKED_ROUTE_PATTERNS,
  DIST_DIR,
  INDEXABLE_STATIC_PATHS,
  PUBLIC_DIR,
  ROBOTS_PATH,
  SEO_CONTENT_MAP_PATH,
  SEO_ROUTE_AUDIT_PATH,
  SITEMAP_INDEX_PATH,
  buildIndexableRoutes,
  loadSeoEnv,
  readSeoContentMap,
  summarizeRoutes,
  toRouteOutputPath,
  writeTextFile,
} from './seo.shared'

type ValidationIssue = {
  scope: string
  message: string
}

const REPORT_PATH = resolve(process.cwd(), 'SEO_VERIFICATION.md')

const readTextFile = (filePath: string) => readFileSync(filePath, 'utf-8')

const parseXmlTagValues = (xml: string, tagName: string) => {
  const pattern = new RegExp(`<${tagName}>([^<]+)</${tagName}>`, 'g')
  const values: string[] = []

  for (const match of xml.matchAll(pattern)) {
    values.push(match[1].trim())
  }

  return values
}

const loadSitemapUrls = () => {
  const sitemapXml = readTextFile(SITEMAP_INDEX_PATH)

  if (sitemapXml.includes('<sitemapindex')) {
    const sitemapLocs = parseXmlTagValues(sitemapXml, 'loc')
    const allUrls: string[] = []

    for (const sitemapLoc of sitemapLocs) {
      const sitemapUrl = new URL(sitemapLoc)
      const sitemapFilePath = resolve(PUBLIC_DIR, sitemapUrl.pathname.replace(/^\//, ''))
      const nestedXml = readTextFile(sitemapFilePath)
      allUrls.push(...parseXmlTagValues(nestedXml, 'loc'))
    }

    return allUrls
  }

  return parseXmlTagValues(sitemapXml, 'loc')
}

const toPathname = (url: string) => {
  const parsed = new URL(url)
  return parsed.pathname
}

const extractTitle = (html: string) => {
  const match = html.match(/<title>([^<]+)<\/title>/i)
  return match?.[1]?.trim() ?? ''
}

const extractMetaDescription = (html: string) => {
  const match = html.match(
    /<meta\s+name=["']description["']\s+content=["']([^"']+)["'][^>]*>/i,
  )
  return match?.[1]?.trim() ?? ''
}

const extractMetaTagContent = (html: string, name: string) => {
  const pattern = new RegExp(`<meta\\s+[^>]*name=["']${name}["'][^>]*>`, 'gi')
  const tags = Array.from(html.matchAll(pattern)).map((match) => match[0])

  if (tags.length === 0) {
    return ''
  }

  const preferredTag =
    tags.find((tag) => /data-rh=["']true["']/i.test(tag)) ??
    tags[tags.length - 1]

  const contentMatch = preferredTag.match(/content=["']([^"']+)["']/i)
  return contentMatch?.[1]?.trim() ?? ''
}

const extractMetaRobots = (html: string) => {
  return extractMetaTagContent(html, 'robots')
}

const extractH1Count = (html: string) => (html.match(/<h1\b/gi) ?? []).length

const extractFirstH1Text = (html: string) => {
  const match = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)
  return match?.[1]?.replace(/<[^>]+>/g, '').trim() ?? ''
}

const extractHeadSnippet = (html: string) => {
  const titleMatch = html.match(/<title>[\s\S]*?<\/title>/i)?.[0] ?? ''
  const descriptionMatch = html.match(
    /<meta\s+name=["']description["'][\s\S]*?>/i,
  )?.[0] ?? ''
  const canonicalMatch = html.match(/<link\s+rel=["']canonical["'][\s\S]*?>/i)?.[0] ?? ''
  const robotsMatch = html.match(/<meta\s+name=["']robots["'][\s\S]*?>/i)?.[0] ?? ''

  return [titleMatch, descriptionMatch, canonicalMatch, robotsMatch]
    .filter(Boolean)
    .join('\n')
}

const validatePageHtml = (
  html: string,
  expectedCanonical: string,
  issues: ValidationIssue[],
  routePath: string,
) => {
  const robots = extractMetaRobots(html)
  const isNoindex = /\bnoindex\b/i.test(robots)

  if (isNoindex) {
    return
  }

  const title = extractTitle(html)
  const description = extractMetaDescription(html)
  const h1Count = extractH1Count(html)

  if (title.length < 10) {
    issues.push({
      scope: routePath,
      message: 'Missing or too short <title> tag.',
    })
  }

  if (description.length < 30) {
    issues.push({
      scope: routePath,
      message: 'Missing or too short meta description.',
    })
  }

  const canonicalPattern = new RegExp(
    `<link\\s+rel=["']canonical["']\\s+href=["']${expectedCanonical.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}["']`,
    'i',
  )

  if (!canonicalPattern.test(html)) {
    issues.push({
      scope: routePath,
      message: `Missing canonical tag with expected URL: ${expectedCanonical}`,
    })
  }

  if (!/<meta\s+property=["']og:title["'][^>]*>/i.test(html)) {
    issues.push({
      scope: routePath,
      message: 'Missing Open Graph title meta tag.',
    })
  }

  if (!/<meta\s+name=["']twitter:card["'][^>]*>/i.test(html)) {
    issues.push({
      scope: routePath,
      message: 'Missing Twitter card meta tag.',
    })
  }

  if (h1Count !== 1) {
    issues.push({
      scope: routePath,
      message: `Expected exactly one <h1>, found ${h1Count}.`,
    })
  }

  const requiredHreflangValues = ['bg', 'en', 'x-default']
  for (const hreflang of requiredHreflangValues) {
    if (!new RegExp(`hrefLang=["']${hreflang}["']`, 'i').test(html)) {
      issues.push({
        scope: routePath,
        message: `Missing hreflang alternate for ${hreflang}.`,
      })
    }
  }
}

const verifyRequiredFiles = (issues: ValidationIssue[]) => {
  const requiredFiles = [
    ROBOTS_PATH,
    SITEMAP_INDEX_PATH,
    SEO_CONTENT_MAP_PATH,
    SEO_ROUTE_AUDIT_PATH,
  ]

  for (const requiredFile of requiredFiles) {
    if (!existsSync(requiredFile)) {
      issues.push({
        scope: 'filesystem',
        message: `Required SEO file is missing: ${requiredFile}`,
      })
    }
  }
}

const buildSampleRoutes = (routePaths: string[]) => {
  const staticCandidates = [
    '/bg/shkoli',
    '/bg/lyceums',
    '/bg/about',
    '/bg/privacy-policy',
  ]

  const dynamicCourse = routePaths.find((path) => /^\/(bg|en)\/shkoli\/\d+$/.test(path))
  const dynamicLyceum = routePaths.find((path) => /^\/(bg|en)\/lyceums\/\d+$/.test(path))

  const sampleRoutes = new Set<string>([...staticCandidates])

  if (dynamicCourse) {
    sampleRoutes.add(dynamicCourse)
  }

  if (dynamicLyceum) {
    sampleRoutes.add(dynamicLyceum)
  }

  return Array.from(sampleRoutes).filter((route) => routePaths.includes(route))
}

const main = () => {
  const env = loadSeoEnv()
  const contentMap = readSeoContentMap()
  const routeEntries = buildIndexableRoutes(contentMap)
  const expectedPaths = routeEntries.map((route) => route.path)

  const issues: ValidationIssue[] = []

  verifyRequiredFiles(issues)

  if (issues.length > 0) {
    throw new Error(issues.map((issue) => issue.message).join('\n'))
  }

  const robots = readTextFile(ROBOTS_PATH)
  if (!robots.includes('Sitemap:')) {
    issues.push({
      scope: 'robots.txt',
      message: 'robots.txt is missing a Sitemap directive.',
    })
  }

  for (const blockedPattern of ['/auth/', '/admin/', '/profile/', '/map']) {
    if (!robots.includes(blockedPattern)) {
      issues.push({
        scope: 'robots.txt',
        message: `robots.txt does not contain expected disallow pattern: ${blockedPattern}`,
      })
    }
  }

  const sitemapUrls = loadSitemapUrls()
  const sitemapPaths = sitemapUrls.map(toPathname)

  const uniqueSitemapPaths = new Set(sitemapPaths)
  if (uniqueSitemapPaths.size !== sitemapPaths.length) {
    issues.push({
      scope: 'sitemap',
      message: 'Sitemap contains duplicate URLs.',
    })
  }

  for (const expectedPath of expectedPaths) {
    if (!uniqueSitemapPaths.has(expectedPath)) {
      issues.push({
        scope: 'sitemap',
        message: `Sitemap is missing expected indexable path: ${expectedPath}`,
      })
    }
  }

  for (const sitemapPath of sitemapPaths) {
    if (sitemapPath.includes('?')) {
      issues.push({
        scope: 'sitemap',
        message: `Sitemap contains query parameter URL: ${sitemapPath}`,
      })
    }

    if (sitemapPath.length > 1 && sitemapPath.endsWith('/')) {
      issues.push({
        scope: 'sitemap',
        message: `Sitemap contains trailing slash URL variant: ${sitemapPath}`,
      })
    }

    if (BLOCKED_ROUTE_PATTERNS.some((pattern) => {
      const normalizedPattern = pattern
        .replace('/:locale', '/(bg|en)')
        .replace('/:id', '/\\d+')
        .replace('*', '.*')
      return new RegExp(`^${normalizedPattern}$`).test(sitemapPath)
    })) {
      issues.push({
        scope: 'sitemap',
        message: `Sitemap contains blocked route pattern match: ${sitemapPath}`,
      })
    }
  }

  const titleRegistry = new Map<string, string[]>()
  const descriptionRegistry = new Map<string, string[]>()

  for (const routePath of expectedPaths) {
    const htmlPath = toRouteOutputPath(DIST_DIR, routePath)

    if (!existsSync(htmlPath)) {
      issues.push({
        scope: routePath,
        message: `Missing prerendered HTML file: ${htmlPath}`,
      })
      continue
    }

    const html = readTextFile(htmlPath)
    const canonicalUrl = `${env.siteUrl}${routePath}`

    validatePageHtml(html, canonicalUrl, issues, routePath)

    const title = extractTitle(html)
    const description = extractMetaDescription(html)

    if (title.length > 0) {
      titleRegistry.set(title, [...(titleRegistry.get(title) ?? []), routePath])
    }

    if (description.length > 0) {
      descriptionRegistry.set(description, [
        ...(descriptionRegistry.get(description) ?? []),
        routePath,
      ])
    }
  }

  const duplicateStaticTitles = Array.from(titleRegistry.entries()).filter(
    ([, routes]) =>
      routes.length > 1 && routes.every((route) => INDEXABLE_STATIC_PATHS.some((path) => route.endsWith(path))),
  )

  for (const [title, routes] of duplicateStaticTitles) {
    issues.push({
      scope: 'metadata',
      message: `Duplicate static page title detected: "${title}" on ${routes.join(', ')}`,
    })
  }

  const duplicateStaticDescriptions = Array.from(descriptionRegistry.entries()).filter(
    ([, routes]) =>
      routes.length > 1 && routes.every((route) => INDEXABLE_STATIC_PATHS.some((path) => route.endsWith(path))),
  )

  for (const [description, routes] of duplicateStaticDescriptions) {
    issues.push({
      scope: 'metadata',
      message: `Duplicate static page description detected: "${description}" on ${routes.join(', ')}`,
    })
  }

  const sampleRoutes = buildSampleRoutes(expectedPaths)
  const sampleSections = sampleRoutes
    .map((routePath) => {
      const htmlPath = toRouteOutputPath(DIST_DIR, routePath)
      const html = readTextFile(htmlPath)

      return [
        `### ${routePath}`,
        '',
        `- h1: ${extractFirstH1Text(html)}`,
        '',
        '```html',
        extractHeadSnippet(html),
        '```',
        '',
      ].join('\n')
    })
    .join('\n')

  const summary = summarizeRoutes(routeEntries)

  const report = [
    '# SEO Verification Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    '## Indexability Map',
    '',
    `- Indexable localized routes: ${summary.total}`,
    `- Static indexable paths: ${INDEXABLE_STATIC_PATHS.join(', ')}`,
    `- Blocked route patterns: ${BLOCKED_ROUTE_PATTERNS.join(', ')}`,
    `- Courses indexed: ${contentMap.courses.length}`,
    `- Lyceums indexed: ${contentMap.lyceums.length}`,
    '',
    '## Sitemap and Robots Validation',
    '',
    `- robots.txt present: ${existsSync(ROBOTS_PATH)}`,
    `- sitemap.xml present: ${existsSync(SITEMAP_INDEX_PATH)}`,
    `- Sitemap URL count: ${sitemapUrls.length}`,
    `- Query-parameter URLs in sitemap: ${sitemapUrls.filter((url) => url.includes('?')).length}`,
    '',
    '## Rendered HTML Samples',
    '',
    sampleSections,
    '## Validation Status',
    '',
    issues.length === 0
      ? '- PASS: All SEO validation checks succeeded.'
      : '- FAIL: One or more SEO validation checks failed.',
    '',
    ...(issues.length === 0
      ? []
      : [
          '### Issues',
          '',
          ...issues.map((issue) => `- [${issue.scope}] ${issue.message}`),
          '',
        ]),
  ].join('\n')

  writeTextFile(REPORT_PATH, report)

  if (issues.length > 0) {
    throw new Error(
      `SEO validation failed with ${issues.length} issue(s). See SEO_VERIFICATION.md.`,
    )
  }

  console.log('[seo:validate] SEO validation completed successfully.')
}

main()
