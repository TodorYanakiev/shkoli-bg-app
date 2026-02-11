export type CookieConsentPreferences = {
  necessary: true
  analytics: boolean
  diagnostics: boolean
}

type CookieConsentSource =
  | 'acceptAll'
  | 'rejectOptional'
  | 'savePreferences'

export type CookieConsentRecord = {
  version: 1
  updatedAt: string
  source: CookieConsentSource
  preferences: CookieConsentPreferences
}

export type EditableCookieConsentPreferences = Pick<
  CookieConsentPreferences,
  'analytics' | 'diagnostics'
>

const COOKIE_CONSENT_STORAGE_KEY = 'education-nearby-cookie-consent'
const COOKIE_CONSENT_EVENT_NAME = 'education-nearby-cookie-consent-change'
const COOKIE_CONSENT_VERSION = 1 as const

const defaultCookieConsentPreferences: CookieConsentPreferences = {
  necessary: true,
  analytics: false,
  diagnostics: false,
}

const allAcceptedCookieConsentPreferences: CookieConsentPreferences = {
  necessary: true,
  analytics: true,
  diagnostics: true,
}

type CookieConsentChangeEvent = CustomEvent<CookieConsentRecord>

declare global {
  interface WindowEventMap {
    'education-nearby-cookie-consent-change': CookieConsentChangeEvent
  }
}

const isBrowser = (): boolean => typeof window !== 'undefined'

const isObjectRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isCookieConsentRecord = (value: unknown): value is CookieConsentRecord => {
  if (!isObjectRecord(value)) return false

  const { version, updatedAt, source, preferences } = value

  if (version !== COOKIE_CONSENT_VERSION) return false
  if (typeof updatedAt !== 'string' || updatedAt.length === 0) return false
  if (
    source !== 'acceptAll' &&
    source !== 'rejectOptional' &&
    source !== 'savePreferences'
  ) {
    return false
  }
  if (!isObjectRecord(preferences)) return false
  if (preferences.necessary !== true) return false
  if (typeof preferences.analytics !== 'boolean') return false
  if (typeof preferences.diagnostics !== 'boolean') return false

  return true
}

const getStoredCookieConsentRecord = (): CookieConsentRecord | null => {
  if (!isBrowser()) {
    return null
  }

  try {
    const rawValue = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)
    if (!rawValue) {
      return null
    }

    const parsedValue: unknown = JSON.parse(rawValue)
    return isCookieConsentRecord(parsedValue) ? parsedValue : null
  } catch {
    return null
  }
}

const dispatchCookieConsentChange = (record: CookieConsentRecord): void => {
  if (!isBrowser()) {
    return
  }

  window.dispatchEvent(
    new CustomEvent<CookieConsentRecord>(COOKIE_CONSENT_EVENT_NAME, {
      detail: record,
    }),
  )
}

const persistCookieConsentRecord = (record: CookieConsentRecord): void => {
  if (!isBrowser()) {
    return
  }

  try {
    window.localStorage.setItem(
      COOKIE_CONSENT_STORAGE_KEY,
      JSON.stringify(record),
    )
  } catch {
    // No-op when browser storage is unavailable.
  }

  dispatchCookieConsentChange(record)
}

const createCookieConsentRecord = (
  preferences: EditableCookieConsentPreferences,
  source: CookieConsentSource,
): CookieConsentRecord => ({
  version: COOKIE_CONSENT_VERSION,
  updatedAt: new Date().toISOString(),
  source,
  preferences: {
    necessary: true,
    analytics: preferences.analytics,
    diagnostics: preferences.diagnostics,
  },
})

export const getDefaultCookieConsentPreferences =
  (): CookieConsentPreferences => ({
    ...defaultCookieConsentPreferences,
  })

export const getAllAcceptedCookieConsentPreferences =
  (): CookieConsentPreferences => ({
    ...allAcceptedCookieConsentPreferences,
  })

export const getCookieConsentRecord = (): CookieConsentRecord | null =>
  getStoredCookieConsentRecord()

export const hasCookieConsentSelection = (): boolean =>
  getStoredCookieConsentRecord() !== null

export const getCookieConsentPreferences = (): CookieConsentPreferences =>
  getStoredCookieConsentRecord()?.preferences ??
  getDefaultCookieConsentPreferences()

export const acceptAllCookieConsent = (): CookieConsentRecord => {
  const record = createCookieConsentRecord(
    getAllAcceptedCookieConsentPreferences(),
    'acceptAll',
  )
  persistCookieConsentRecord(record)
  return record
}

export const rejectOptionalCookieConsent = (): CookieConsentRecord => {
  const record = createCookieConsentRecord(
    getDefaultCookieConsentPreferences(),
    'rejectOptional',
  )
  persistCookieConsentRecord(record)
  return record
}

export const saveCookieConsentPreferences = (
  preferences: EditableCookieConsentPreferences,
): CookieConsentRecord => {
  const record = createCookieConsentRecord(preferences, 'savePreferences')
  persistCookieConsentRecord(record)
  return record
}

export const subscribeToCookieConsentChange = (
  listener: () => void,
): (() => void) => {
  if (!isBrowser()) {
    return () => undefined
  }

  const onCookieConsentChange = () => {
    listener()
  }

  const onStorageChange = (event: StorageEvent) => {
    if (event.key === COOKIE_CONSENT_STORAGE_KEY) {
      listener()
    }
  }

  window.addEventListener(COOKIE_CONSENT_EVENT_NAME, onCookieConsentChange)
  window.addEventListener('storage', onStorageChange)

  return () => {
    window.removeEventListener(
      COOKIE_CONSENT_EVENT_NAME,
      onCookieConsentChange,
    )
    window.removeEventListener('storage', onStorageChange)
  }
}
