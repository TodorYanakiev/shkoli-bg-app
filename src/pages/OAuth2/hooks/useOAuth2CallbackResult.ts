import { useEffect, useMemo } from 'react'

import { parseOAuth2CallbackHash } from '../services/oauth2CallbackParser'

export const useOAuth2CallbackResult = () => {
  const callbackResult = useMemo(() => {
    if (typeof window === 'undefined') {
      return parseOAuth2CallbackHash('')
    }

    return parseOAuth2CallbackHash(window.location.hash)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (!window.location.hash) {
      return
    }

    window.history.replaceState(
      null,
      document.title,
      `${window.location.pathname}${window.location.search}`,
    )
  }, [])

  return callbackResult
}
