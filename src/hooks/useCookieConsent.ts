import { useEffect, useMemo, useState } from 'react'

import {
  acceptAllCookieConsent,
  getCookieConsentRecord,
  getDefaultCookieConsentPreferences,
  rejectOptionalCookieConsent,
  saveCookieConsentPreferences,
  subscribeToCookieConsentChange,
  type CookieConsentPreferences,
  type CookieConsentRecord,
  type EditableCookieConsentPreferences,
} from '../services/cookieConsent'

type UseCookieConsentResult = {
  hasSelection: boolean
  record: CookieConsentRecord | null
  preferences: CookieConsentPreferences
  acceptAll: () => void
  rejectOptional: () => void
  savePreferences: (preferences: EditableCookieConsentPreferences) => void
}

const getCookieConsentSnapshot = (): CookieConsentRecord | null =>
  getCookieConsentRecord()

export const useCookieConsent = (): UseCookieConsentResult => {
  const [record, setRecord] = useState<CookieConsentRecord | null>(() =>
    getCookieConsentSnapshot(),
  )

  useEffect(() => {
    const unsubscribe = subscribeToCookieConsentChange(() => {
      setRecord(getCookieConsentSnapshot())
    })

    return unsubscribe
  }, [])

  const preferences = useMemo(
    () => record?.preferences ?? getDefaultCookieConsentPreferences(),
    [record],
  )

  const acceptAll = () => {
    const nextRecord = acceptAllCookieConsent()
    setRecord(nextRecord)
  }

  const rejectOptional = () => {
    const nextRecord = rejectOptionalCookieConsent()
    setRecord(nextRecord)
  }

  const savePreferences = (nextPreferences: EditableCookieConsentPreferences) => {
    const nextRecord = saveCookieConsentPreferences(nextPreferences)
    setRecord(nextRecord)
  }

  return {
    hasSelection: record !== null,
    record,
    preferences,
    acceptAll,
    rejectOptional,
    savePreferences,
  }
}

