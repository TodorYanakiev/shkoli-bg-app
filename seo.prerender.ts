import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process'
import { existsSync } from 'node:fs'
import { createServer } from 'node:net'
import { resolve } from 'node:path'

import { chromium, type Page } from '@playwright/test'

import {
  DIST_DIR,
  buildIndexableRoutes,
  readSeoContentMap,
  toRouteOutputPath,
  writeTextFile,
} from './seo.shared'

const DEFAULT_PREVIEW_PORT = Number.parseInt(
  process.env.SEO_PREVIEW_PORT ?? '4173',
  10,
)
const SERVER_READY_TIMEOUT_MS = 120_000
const PAGE_TIMEOUT_MS = Number.parseInt(
  process.env.SEO_PAGE_TIMEOUT_MS ?? '20000',
  10,
)
const RENDER_SETTLE_TIMEOUT_MS = Number.parseInt(
  process.env.SEO_RENDER_SETTLE_MS ?? '300',
  10,
)
const ROUTE_READY_TIMEOUT_MS = Number.parseInt(
  process.env.SEO_ROUTE_READY_TIMEOUT_MS ?? '10000',
  10,
)
const MAX_RENDER_ATTEMPTS = Math.max(
  1,
  Number.parseInt(process.env.SEO_PRERENDER_RETRIES ?? '2', 10),
)
const PRERENDER_WORKERS = Math.max(
  1,
  Number.parseInt(process.env.SEO_PRERENDER_WORKERS ?? '4', 10),
)

const wait = (milliseconds: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })

const waitForServerReady = async (origin: string, timeoutMs: number) => {
  const startedAt = Date.now()

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(origin, {
        redirect: 'manual',
        signal: AbortSignal.timeout(1_000),
      })

      if (response.status >= 200 && response.status < 500) {
        return
      }
    } catch {
      // ignore while booting
    }

    await wait(400)
  }

  throw new Error(`Timed out waiting for preview server at ${origin}`)
}

const canBindPort = (port: number) =>
  new Promise<boolean>((resolve) => {
    const server = createServer()

    server.once('error', () => {
      resolve(false)
    })

    server.once('listening', () => {
      server.close(() => resolve(true))
    })

    server.listen(port, '127.0.0.1')
  })

const findAvailablePort = async (startingPort: number) => {
  const MAX_PORT_ATTEMPTS = 50

  for (let offset = 0; offset < MAX_PORT_ATTEMPTS; offset += 1) {
    const candidatePort = startingPort + offset

    if (await canBindPort(candidatePort)) {
      return candidatePort
    }
  }

  throw new Error(
    `Unable to find an available preview port starting from ${startingPort}.`,
  )
}

const spawnPreviewServer = (previewPort: number) => {
  const viteCliPath = resolve(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js')
  if (!existsSync(viteCliPath)) {
    throw new Error(`Unable to locate Vite CLI at ${viteCliPath}.`)
  }

  const processHandle = spawn(
    process.execPath,
    [
      viteCliPath,
      'preview',
      '--port',
      previewPort.toString(),
      '--host',
      '127.0.0.1',
      '--strictPort',
    ],
    {
      cwd: process.cwd(),
      shell: false,
      stdio: 'pipe',
      windowsHide: true,
    },
  )

  processHandle.stdout.on('data', (chunk) => {
    const message = chunk.toString().trim()
    if (message.length > 0) {
      console.log(`[seo:prerender] ${message}`)
    }
  })

  processHandle.stderr.on('data', (chunk) => {
    const message = chunk.toString().trim()
    if (message.length > 0) {
      console.warn(`[seo:prerender] ${message}`)
    }
  })

  return processHandle
}

const shutdownPreviewServer = async (
  processHandle: ChildProcessWithoutNullStreams,
) => {
  if (processHandle.killed || processHandle.exitCode !== null) {
    return
  }

  processHandle.kill('SIGTERM')

  const startedAt = Date.now()
  while (Date.now() - startedAt < 5_000) {
    if (processHandle.exitCode !== null) {
      return
    }
    await wait(100)
  }

  processHandle.kill('SIGKILL')
}

const getRoutesForPrerender = () => {
  const contentMap = readSeoContentMap()
  const allRoutes = buildIndexableRoutes(contentMap)
  const maxRoutes = Number.parseInt(
    process.env.SEO_PRERENDER_MAX_ROUTES ?? '0',
    10,
  )

  const routes = maxRoutes > 0 ? allRoutes.slice(0, maxRoutes) : allRoutes

  return routes.map((route) => route.path)
}

const waitForRouteReady = async (page: Page) => {
  await page.waitForFunction(
    () => {
      const head = document.head
      const title = head.querySelector('title')
      const canonical = head.querySelector('link[rel="canonical"]')
      const robots = head.querySelector('meta[name="robots"]')
      const routeFallback = document.querySelector(
        '[data-route-suspense-fallback="true"]',
      )
      const localeLoading = document.querySelector('[data-locale-loading="true"]')
      const hasAppError = document.body.textContent?.includes(
        'Unexpected Application Error!',
      )
      const canonicalPathname = canonical
        ? new URL(canonical.getAttribute('href') ?? '', window.location.origin)
            .pathname
        : ''

      return (
        Boolean(title) &&
        Boolean(canonical) &&
        Boolean(robots) &&
        !Boolean(routeFallback) &&
        !Boolean(localeLoading) &&
        !Boolean(hasAppError) &&
        canonicalPathname === window.location.pathname
      )
    },
    undefined,
    {
      timeout: ROUTE_READY_TIMEOUT_MS,
    },
  )
}

const main = async () => {
  if (!existsSync(DIST_DIR)) {
    throw new Error(
      'Missing dist directory. Run the production build before seo:prerender.',
    )
  }

  const routes = getRoutesForPrerender()
  if (routes.length === 0) {
    console.log('[seo:prerender] No indexable routes to prerender.')
    return
  }

  const previewPort = await findAvailablePort(DEFAULT_PREVIEW_PORT)
  const previewOrigin = `http://127.0.0.1:${previewPort}`

  console.log(
    `[seo:prerender] Prerendering ${routes.length} routes from ${previewOrigin} with ${Math.min(PRERENDER_WORKERS, routes.length)} workers.`,
  )

  const previewServer = spawnPreviewServer(previewPort)
  const previewServerExitedUnexpectedly = () =>
    previewServer.exitCode !== null && previewServer.exitCode !== 0

  try {
    await waitForServerReady(previewOrigin, SERVER_READY_TIMEOUT_MS)

    if (previewServerExitedUnexpectedly()) {
      throw new Error(
        `Preview server exited unexpectedly with code ${previewServer.exitCode}.`,
      )
    }

    const browser = await chromium.launch()

    const failures: Array<{ route: string; reason: string }> = []
    let routeIndex = 0

    const takeNextRoute = () => {
      if (routeIndex >= routes.length) {
        return null
      }

      const route = routes[routeIndex]
      routeIndex += 1
      return route
    }

    const workerCount = Math.min(PRERENDER_WORKERS, routes.length)

    const workers = Array.from({ length: workerCount }, (_, workerIndex) =>
      (async () => {
        const page = await browser.newPage()

        while (true) {
          if (previewServerExitedUnexpectedly()) {
            throw new Error(
              `Preview server exited unexpectedly with code ${previewServer.exitCode}.`,
            )
          }

          const route = takeNextRoute()
          if (!route) {
            break
          }

          const routeUrl = `${previewOrigin}${route}`

          let completed = false

          for (
            let attempt = 1;
            attempt <= MAX_RENDER_ATTEMPTS && !completed;
            attempt += 1
          ) {
            try {
              await page.goto(routeUrl, {
                waitUntil: 'domcontentloaded',
                timeout: PAGE_TIMEOUT_MS,
              })

              await waitForRouteReady(page)
              await page.waitForTimeout(RENDER_SETTLE_TIMEOUT_MS)

              const html = await page.evaluate(
                () =>
                  `<!doctype html>\n${document.documentElement.outerHTML}`,
              )

              const outputPath = toRouteOutputPath(DIST_DIR, route)
              writeTextFile(outputPath, html)

              console.log(
                `[seo:prerender] Worker ${workerIndex + 1} wrote ${outputPath}`,
              )

              completed = true
            } catch (error) {
              const reason =
                error instanceof Error
                  ? error.message
                  : 'Unknown prerender error'

              if (attempt >= MAX_RENDER_ATTEMPTS) {
                failures.push({ route, reason })
                console.warn(`[seo:prerender] Failed ${route}: ${reason}`)
                break
              }

              console.warn(
                `[seo:prerender] Retry ${attempt}/${MAX_RENDER_ATTEMPTS - 1} for ${route}: ${reason}`,
              )

              await page.waitForTimeout(400)
            }
          }
        }

        await page.close()
      })(),
    )

    await Promise.all(workers)
    await browser.close()

    if (failures.length > 0) {
      throw new Error(
        `Prerender failed for ${failures.length} routes. First failure: ${failures[0].route}`,
      )
    }
  } finally {
    await shutdownPreviewServer(previewServer)
  }
}

void main()
