import type { AuthTokens } from '../types/auth'

const ACCESS_TOKEN_KEY = 'auth.accessToken'
const REFRESH_TOKEN_KEY = 'auth.refreshToken'

export const AUTH_TOKENS_CHANGED_EVENT = 'auth:tokens-changed'

const hasStorage = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

const getItem = (key: string) => {
  if (!hasStorage()) return null
  return window.localStorage.getItem(key)
}

const setItem = (key: string, value: string | undefined) => {
  if (!hasStorage()) return
  if (value) {
    window.localStorage.setItem(key, value)
  } else {
    window.localStorage.removeItem(key)
  }
}

const emitTokensChanged = () => {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(AUTH_TOKENS_CHANGED_EVENT))
}

export const getAccessToken = () => getItem(ACCESS_TOKEN_KEY)

export const getRefreshToken = () => getItem(REFRESH_TOKEN_KEY)

export const setTokens = ({ accessToken, refreshToken }: AuthTokens) => {
  setItem(ACCESS_TOKEN_KEY, accessToken)
  setItem(REFRESH_TOKEN_KEY, refreshToken)
  emitTokensChanged()
}

export const clearTokens = () => {
  if (!hasStorage()) return
  window.localStorage.removeItem(ACCESS_TOKEN_KEY)
  window.localStorage.removeItem(REFRESH_TOKEN_KEY)
  emitTokensChanged()
}
