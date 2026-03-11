import { readdirSync, unlinkSync } from 'node:fs'
import { resolve } from 'node:path'

import {
  BLOCKED_ROUTE_PATTERNS,
  HTML_SITEMAP_PATH,
  INDEXABLE_STATIC_PATHS,
  LEGACY_REDIRECTS,
  PUBLIC_DIR,
  ROBOTS_PATH,
  SEO_ROUTE_AUDIT_PATH,
  SITEMAP_INDEX_PATH,
  buildIndexableRoutes,
  loadSeoEnv,
  readSeoContentMap,
  summarizeRoutes,
  supportedLanguages,
  toAbsoluteUrl,
  writeJsonFile,
  writeTextFile,
  xmlEscape,
} from './seo.shared'

type SitemapUrlEntry = {
  loc: string
  lastmod: string
}

const SITEMAP_CHUNK_SIZE = 5000

const chunkArray = <T,>(items: T[], chunkSize: number): T[][] => {
  if (items.length === 0) {
    return []
  }

  const chunks: T[][] = []

  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize))
  }

  return chunks
}

const cleanupLegacySitemaps = () => {
  const entries = readdirSync(PUBLIC_DIR, { withFileTypes: true })

  for (const entry of entries) {
    if (!entry.isFile()) {
      continue
    }

    if (!/^sitemap-(\d+)\.xml$/i.test(entry.name)) {
      continue
    }

    unlinkSync(resolve(PUBLIC_DIR, entry.name))
  }
}

const buildUrlSetXml = (entries: SitemapUrlEntry[]) => {
  const body = entries
    .map(
      (entry) =>
        `  <url>\n    <loc>${xmlEscape(entry.loc)}</loc>\n    <lastmod>${xmlEscape(entry.lastmod)}</lastmod>\n  </url>`,
    )
    .join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    body,
    '</urlset>',
    '',
  ].join('\n')
}

const buildSitemapIndexXml = (entries: SitemapUrlEntry[]) => {
  const body = entries
    .map(
      (entry) =>
        `  <sitemap>\n    <loc>${xmlEscape(entry.loc)}</loc>\n    <lastmod>${xmlEscape(entry.lastmod)}</lastmod>\n  </sitemap>`,
    )
    .join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    body,
    '</sitemapindex>',
    '',
  ].join('\n')
}

const buildRobots = (siteUrl: string) => {
  const localizedDisallowRules = supportedLanguages.flatMap((locale) => [
    `Disallow: /${locale}/auth/`,
    `Disallow: /${locale}/admin/`,
    `Disallow: /${locale}/profile/`,
    `Disallow: /${locale}/map`,
    `Disallow: /${locale}/shkoli/new`,
    `Disallow: /${locale}/shkoli/*/edit`,
    `Disallow: /${locale}/lyceums/*/edit`,
  ])
  const aiCrawlerDisallowRules = [
    'User-agent: Amazonbot',
    'Disallow: /',
    '',
    'User-agent: Applebot-Extended',
    'Disallow: /',
    '',
    'User-agent: Bytespider',
    'Disallow: /',
    '',
    'User-agent: CCBot',
    'Disallow: /',
    '',
    'User-agent: ClaudeBot',
    'Disallow: /',
    '',
    'User-agent: Google-Extended',
    'Disallow: /',
    '',
    'User-agent: GPTBot',
    'Disallow: /',
    '',
    'User-agent: meta-externalagent',
    'Disallow: /',
  ]

  return [
    'User-agent: *',
    'Allow: /',
    ...localizedDisallowRules,
    'Disallow: /*?*',
    '',
    ...aiCrawlerDisallowRules,
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    '',
  ].join('\n')
}

const buildHtmlSitemap = (
  siteUrl: string,
  routes: Array<{ path: string; lastmod: string; source: string }>,
) => {
  const staticRoutes = routes.filter((route) => route.source === 'static')
  const courseRoutes = routes.filter((route) => route.source === 'course')
  const lyceumRoutes = routes.filter((route) => route.source === 'lyceum')

  const toList = (items: Array<{ path: string; lastmod: string }>) =>
    items
      .map(
        (item) =>
          `<li><a href="${xmlEscape(item.path)}">${xmlEscape(item.path)}</a> <small>${xmlEscape(
            item.lastmod,
          )}</small></li>`,
      )
      .join('\n')

  return [
    '<!doctype html>',
    '<html lang="en">',
    '  <head>',
    '    <meta charset="UTF-8" />',
    '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    '    <title>Shkoli.bg HTML Sitemap</title>',
    `    <link rel="canonical" href="${xmlEscape(`${siteUrl}/site-map.html`)}" />`,
    '    <meta name="robots" content="index,follow" />',
    '    <style>',
    '      body { font-family: Arial, sans-serif; margin: 2rem auto; max-width: 64rem; line-height: 1.5; color: #0f172a; padding: 0 1rem; }',
    '      h1, h2 { color: #064e3b; }',
    '      ul { padding-left: 1.2rem; }',
    '      li { margin-bottom: 0.35rem; }',
    '      small { color: #64748b; margin-left: 0.5rem; }',
    '    </style>',
    '  </head>',
    '  <body>',
    '    <header>',
    '      <h1>Shkoli.bg HTML Sitemap</h1>',
    '      <p>Indexable routes grouped by content type and locale.</p>',
    '    </header>',
    '    <main>',
    '      <section>',
    '        <h2>Static Pages</h2>',
    `        <ul>${toList(staticRoutes)}</ul>`,
    '      </section>',
    '      <section>',
    '        <h2>Course Detail Pages</h2>',
    `        <ul>${toList(courseRoutes)}</ul>`,
    '      </section>',
    '      <section>',
    '        <h2>Lyceum Detail Pages</h2>',
    `        <ul>${toList(lyceumRoutes)}</ul>`,
    '      </section>',
    '    </main>',
    '  </body>',
    '</html>',
    '',
  ].join('\n')
}

const main = () => {
  const env = loadSeoEnv()
  const contentMap = readSeoContentMap()
  const routes = buildIndexableRoutes(contentMap)

  const summary = summarizeRoutes(routes)
  const generatedAtDate = new Date(contentMap.generatedAt)
  const staticLastmod = Number.isNaN(generatedAtDate.getTime())
    ? new Date().toISOString().slice(0, 10)
    : generatedAtDate.toISOString().slice(0, 10)

  const sitemapEntries: SitemapUrlEntry[] = routes.map((route) => ({
    loc: toAbsoluteUrl(env.siteUrl, route.path),
    lastmod: route.lastmod,
  }))

  sitemapEntries.push({
    loc: `${env.siteUrl}/site-map.html`,
    lastmod: staticLastmod,
  })

  cleanupLegacySitemaps()

  const chunks = chunkArray(sitemapEntries, SITEMAP_CHUNK_SIZE)

  if (chunks.length <= 1) {
    const singleSitemap = buildUrlSetXml(chunks[0] ?? [])
    writeTextFile(SITEMAP_INDEX_PATH, singleSitemap)
  } else {
    const indexEntries: SitemapUrlEntry[] = []

    chunks.forEach((chunk, index) => {
      const fileName = `sitemap-${index + 1}.xml`
      const filePath = resolve(PUBLIC_DIR, fileName)
      writeTextFile(filePath, buildUrlSetXml(chunk))

      indexEntries.push({
        loc: `${env.siteUrl}/${fileName}`,
        lastmod: chunk[0]?.lastmod ?? contentMap.generatedAt,
      })
    })

    writeTextFile(SITEMAP_INDEX_PATH, buildSitemapIndexXml(indexEntries))
  }

  writeTextFile(ROBOTS_PATH, buildRobots(env.siteUrl))

  writeTextFile(
    HTML_SITEMAP_PATH,
    buildHtmlSitemap(
      env.siteUrl,
      routes.map((route) => ({
        path: route.path,
        lastmod: route.lastmod,
        source: route.source,
      })),
    ),
  )

  writeJsonFile(SEO_ROUTE_AUDIT_PATH, {
    generatedAt: new Date().toISOString(),
    siteUrl: env.siteUrl,
    locales: supportedLanguages,
    summary,
    indexable: {
      staticPaths: INDEXABLE_STATIC_PATHS,
      localizedRouteCount: routes.length,
      localizedRoutes: routes.map((route) => ({
        path: route.path,
        locale: route.locale,
        lastmod: route.lastmod,
        source: route.source,
      })),
      paginationAndFilterStrategy: {
        '/:locale/shkoli': 'Query parameter variants are noindex and canonicalize to /:locale/shkoli',
        '/:locale/lyceums': 'Query parameter variants are noindex and canonicalize to /:locale/lyceums',
      },
    },
    blocked: {
      patterns: BLOCKED_ROUTE_PATTERNS,
      robotsDisallowQueryPattern: '/*?*',
      metaRobots: 'noindex,follow on blocked pages',
    },
    canonicalization: {
      trailingSlash: 'Removed via redirect at the web server layer',
      duplicateHosts: 'www host redirects to apex host in nginx config',
      legacyPathRedirects: LEGACY_REDIRECTS,
    },
  })

  console.log(
    `[seo:generate] Generated robots.txt, sitemap.xml, route audit, and HTML sitemap with ${sitemapEntries.length} indexable URLs.`,
  )
}

main()
