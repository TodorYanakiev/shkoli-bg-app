import { useEffect, useState } from 'react'

import {
  AUTH_TOKENS_CHANGED_EVENT,
  getAccessToken,
} from '../utils/authStorage'

export const useAuthStatus = () => {
  const [accessToken, setAccessToken] = useState(() => getAccessToken())

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const handleTokensChange = () => {
      setAccessToken(getAccessToken())
    }

    window.addEventListener('storage', handleTokensChange)
    window.addEventListener(AUTH_TOKENS_CHANGED_EVENT, handleTokensChange)

    return () => {
      window.removeEventListener('storage', handleTokensChange)
      window.removeEventListener(AUTH_TOKENS_CHANGED_EVENT, handleTokensChange)
    }
  }, [])

  return { isAuthenticated: Boolean(accessToken) }
}
