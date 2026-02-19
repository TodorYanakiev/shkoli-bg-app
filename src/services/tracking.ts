import { env } from './env'

const GOOGLE_ANALYTICS_SCRIPT_ID = 'ga-gtag-script'
const HOTJAR_SCRIPT_ID = 'hotjar-script'
const CONTENTSQUARE_SCRIPT_ID = 'contentsquare-uxa-script'
const CONTENTSQUARE_SCRIPT_SRC =
  'https://t.contentsquare.net/uxa/d3c813633efbc.js'
const CONTENTSQUARE_PREFIXES = ['_cs', 'cs_']
const CONTENTSQUARE_OPTOUT_COOKIE_NAME = '_cs_optout'
const CONTENTSQUARE_COOKIE_PREFIXES_TO_CLEAR = [
  '_cs_id',
  '_cs_s',
  '_cs_ex',
  '_cs_cvars',
  '_cs_root-domain',
  'cs_',
]

type GtagFunction = {
  (command: 'js', timestamp: Date): void
  (
    command: 'config',
    measurementId: string,
    options?: Record<string, unknown>,
  ): void
  (
    command: 'consent',
    action: 'default' | 'update',
    options: GoogleConsentOptions,
  ): void
  (command: 'event', eventName: string, params?: Record<string, unknown>): void
}

type GoogleConsentState = 'granted' | 'denied'

type GoogleConsentOptions = {
  analytics_storage: GoogleConsentState
  ad_storage: GoogleConsentState
  ad_user_data: GoogleConsentState
  ad_personalization: GoogleConsentState
  wait_for_update?: number
}

type HotjarFunction = {
  (command: string, ...args: unknown[]): void
  q?: unknown[][]
}

type ContentsquareCommand =
  | ['trackPageview', string]
  | ['optout']
type ContentsquareQueue = ContentsquareCommand[]

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: GtagFunction
    hj?: HotjarFunction
    _hjSettings?: {
      hjid: number
      hjsv: number
    }
    _uxa?: ContentsquareQueue
  }
}

let isGoogleAnalyticsInitialized = false
let isHotjarInitialized = false
let isContentsquareInitialized = false
let contentsquareCleanupTimeouts: number[] = []

const isBrowser = (): boolean => typeof window !== 'undefined'

const ensureManagedScript = (id: string, src: string): void => {
  if (!isBrowser() || !src) {
    return
  }

  if (document.getElementById(id)) {
    return
  }

  const scriptElement = document.createElement('script')
  scriptElement.id = id
  scriptElement.src = src
  scriptElement.async = true
  scriptElement.dataset.cookieManaged = 'true'
  document.head.append(scriptElement)
}

const removeManagedScript = (id: string): void => {
  if (!isBrowser()) {
    return
  }

  const scriptElement = document.getElementById(id)
  if (scriptElement?.parentNode) {
    scriptElement.parentNode.removeChild(scriptElement)
  }
}

const getCookieName = (cookieEntry: string): string =>
  cookieEntry.split('=')[0]?.trim() ?? ''

const deleteCookie = (name: string, domain?: string): void => {
  const domainSegment = domain ? `;domain=${domain}` : ''
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/${domainSegment};SameSite=Lax`
}

const setCookie = (name: string, value: string, domain?: string): void => {
  const domainSegment = domain ? `;domain=${domain}` : ''
  const expires = new Date(
    Date.now() + 365 * 24 * 60 * 60 * 1_000,
  ).toUTCString()
  document.cookie = `${name}=${value};expires=${expires};path=/${domainSegment};SameSite=Lax`
}

const getDomainCandidates = (): Array<string | undefined> => {
  if (!isBrowser()) {
    return []
  }

  const hostname = window.location.hostname
  if (!hostname) {
    return [undefined]
  }

  const domainCandidates = new Set<string | undefined>([
    undefined,
    hostname,
    `.${hostname}`,
  ])

  const hostSegments = hostname.split('.')
  if (hostSegments.length > 2) {
    const rootDomain = hostSegments.slice(-2).join('.')
    domainCandidates.add(rootDomain)
    domainCandidates.add(`.${rootDomain}`)
  }

  return Array.from(domainCandidates)
}

const clearCookiesByPrefix = (prefixes: string[]): void => {
  if (!isBrowser() || document.cookie.length === 0) {
    return
  }

  const normalizedPrefixes = prefixes.map((prefix) => prefix.toLowerCase())
  const matchingCookies = document.cookie
    .split(';')
    .map((entry) => getCookieName(entry))
    .filter((cookieName) => {
      const normalizedCookieName = cookieName.toLowerCase()
      return normalizedPrefixes.some((prefix) =>
        normalizedCookieName.startsWith(prefix),
      )
    })

  if (matchingCookies.length === 0) {
    return
  }

  const domainCandidates = getDomainCandidates()
  matchingCookies.forEach((cookieName) => {
    domainCandidates.forEach((domain) => {
      deleteCookie(cookieName, domain)
    })
  })
}

const clearStorageByPrefix = (
  storage: Storage,
  prefixes: string[],
): void => {
  try {
    const normalizedPrefixes = prefixes.map((prefix) => prefix.toLowerCase())
    const keysToRemove: string[] = []

    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index)
      if (!key) {
        continue
      }

      const normalizedKey = key.toLowerCase()
      if (
        normalizedPrefixes.some((prefix) => normalizedKey.startsWith(prefix))
      ) {
        keysToRemove.push(key)
      }
    }

    keysToRemove.forEach((key) => {
      storage.removeItem(key)
    })
  } catch {
    // No-op when browser storage is unavailable.
  }
}

const ensureGoogleAnalyticsQueue = (): void => {
  if (!isBrowser()) {
    return
  }

  if (!Array.isArray(window.dataLayer)) {
    window.dataLayer = []
  }

  if (!window.gtag) {
    const gtagFunction = function (): void {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments as unknown)
    }

    window.gtag = gtagFunction as GtagFunction
  }
}

const getGrantedGoogleConsent = (): GoogleConsentOptions => ({
  analytics_storage: 'granted',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
})

const getDeniedGoogleConsent = (): GoogleConsentOptions => ({
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
})

const getHotjarSiteId = (): number | null => {
  if (!env.hotjarSiteId) {
    return null
  }

  const parsedSiteId = Number.parseInt(env.hotjarSiteId, 10)
  return Number.isFinite(parsedSiteId) ? parsedSiteId : null
}

const ensureHotjarQueue = (siteId: number): void => {
  if (!isBrowser()) {
    return
  }

  if (!window.hj) {
    const hotjarQueueFunction: HotjarFunction = (
      command: string,
      ...args: unknown[]
    ) => {
      if (!hotjarQueueFunction.q) {
        hotjarQueueFunction.q = []
      }

      hotjarQueueFunction.q.push([command, ...args])
    }

    hotjarQueueFunction.q = []
    window.hj = hotjarQueueFunction
  }

  window._hjSettings = {
    hjid: siteId,
    hjsv: env.hotjarVersion,
  }
}

const getContentsquareQueue = (): ContentsquareQueue => {
  if (!Array.isArray(window._uxa)) {
    window._uxa = []
  }

  return window._uxa
}

const sendContentsquareOptOut = (): void => {
  if (!isBrowser()) {
    return
  }

  const queue = getContentsquareQueue()
  queue.push(['optout'])
}

const setContentsquareOptOutCookie = (): void => {
  if (!isBrowser()) {
    return
  }

  const domainCandidates = getDomainCandidates()
  domainCandidates.forEach((domain) => {
    setCookie(CONTENTSQUARE_OPTOUT_COOKIE_NAME, 'true', domain)
  })
}

const clearContentsquareArtifacts = (): void => {
  if (!isBrowser()) {
    return
  }

  clearCookiesByPrefix(CONTENTSQUARE_COOKIE_PREFIXES_TO_CLEAR)
  clearStorageByPrefix(window.localStorage, CONTENTSQUARE_PREFIXES)
  clearStorageByPrefix(window.sessionStorage, CONTENTSQUARE_PREFIXES)
}

const clearScheduledContentsquareCleanup = (): void => {
  if (!isBrowser() || contentsquareCleanupTimeouts.length === 0) {
    return
  }

  contentsquareCleanupTimeouts.forEach((timeoutId) => {
    window.clearTimeout(timeoutId)
  })
  contentsquareCleanupTimeouts = []
}

const scheduleContentsquareCleanupRetries = (): void => {
  if (!isBrowser()) {
    return
  }

  clearScheduledContentsquareCleanup()

  const retryDelays = [150, 600, 2_000]
  contentsquareCleanupTimeouts = retryDelays.map((delay) =>
    window.setTimeout(() => {
      clearContentsquareArtifacts()
      setContentsquareOptOutCookie()
    }, delay),
  )
}

export const enableGoogleAnalytics = (): void => {
  if (!isBrowser() || !env.gaMeasurementId) {
    return
  }

  ensureGoogleAnalyticsQueue()
  ensureManagedScript(
    GOOGLE_ANALYTICS_SCRIPT_ID,
    `https://www.googletagmanager.com/gtag/js?id=${env.gaMeasurementId}`,
  )

  window.gtag?.('consent', 'update', getGrantedGoogleConsent())

  if (isGoogleAnalyticsInitialized) {
    return
  }

  window.gtag?.('js', new Date())
  window.gtag?.('config', env.gaMeasurementId, {
    anonymize_ip: true,
    send_page_view: false,
  })
  isGoogleAnalyticsInitialized = true
}

export const trackGoogleAnalyticsPageView = (pagePath: string): void => {
  if (!isBrowser() || !env.gaMeasurementId || !window.gtag) {
    return
  }

  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_title: document.title,
  })
}

export const disableGoogleAnalytics = (): void => {
  if (!isBrowser()) {
    return
  }

  window.gtag?.('consent', 'update', getDeniedGoogleConsent())
  removeManagedScript(GOOGLE_ANALYTICS_SCRIPT_ID)
  clearCookiesByPrefix(['_ga', '_gid', '_gat', '_gcl'])
  clearStorageByPrefix(window.localStorage, ['_ga', '_gcl'])
  clearStorageByPrefix(window.sessionStorage, ['_ga', '_gcl'])
  // Keep GA globals in a safe shape to avoid async `dataLayer.push` crashes
  // from the script while/after consent is being revoked.
  if (!Array.isArray(window.dataLayer)) {
    window.dataLayer = []
  }
  window.gtag = undefined
  isGoogleAnalyticsInitialized = false
}

export const enableHotjar = (): void => {
  if (!isBrowser()) {
    return
  }

  const hotjarSiteId = getHotjarSiteId()
  if (!hotjarSiteId) {
    return
  }

  ensureHotjarQueue(hotjarSiteId)
  ensureManagedScript(
    HOTJAR_SCRIPT_ID,
    `https://static.hotjar.com/c/hotjar-${hotjarSiteId}.js?sv=${env.hotjarVersion}`,
  )
  isHotjarInitialized = true
}

export const trackHotjarPageView = (pagePath: string): void => {
  if (!isBrowser() || !isHotjarInitialized || !window.hj) {
    return
  }

  window.hj('stateChange', pagePath)
}

export const disableHotjar = (): void => {
  if (!isBrowser()) {
    return
  }

  removeManagedScript(HOTJAR_SCRIPT_ID)
  clearCookiesByPrefix(['_hj'])
  clearStorageByPrefix(window.localStorage, ['_hj'])
  clearStorageByPrefix(window.sessionStorage, ['_hj'])
  window.hj = undefined
  window._hjSettings = undefined
  isHotjarInitialized = false
}

export const enableContentsquare = (): void => {
  if (!isBrowser()) {
    return
  }
  if (!env.contentsquareEnabled) {
    isContentsquareInitialized = false
    removeManagedScript(CONTENTSQUARE_SCRIPT_ID)
    return
  }

  clearScheduledContentsquareCleanup()
  clearCookiesByPrefix([CONTENTSQUARE_OPTOUT_COOKIE_NAME])
  window._uxa = []
  ensureManagedScript(CONTENTSQUARE_SCRIPT_ID, CONTENTSQUARE_SCRIPT_SRC)
  isContentsquareInitialized = true
}

export const trackContentsquarePageView = (pagePath: string): void => {
  if (!isBrowser() || !isContentsquareInitialized) {
    return
  }

  const queue = getContentsquareQueue()
  queue.push(['trackPageview', pagePath])
}

export const disableContentsquare = (): void => {
  if (!isBrowser()) {
    return
  }

  sendContentsquareOptOut()
  setContentsquareOptOutCookie()
  window._uxa = [['optout']]
  removeManagedScript(CONTENTSQUARE_SCRIPT_ID)
  clearContentsquareArtifacts()
  scheduleContentsquareCleanupRetries()
  isContentsquareInitialized = false
}

export const enforceContentsquareOptOut = (): void => {
  if (!isBrowser()) {
    return
  }

  sendContentsquareOptOut()
  setContentsquareOptOutCookie()
  clearContentsquareArtifacts()
}
