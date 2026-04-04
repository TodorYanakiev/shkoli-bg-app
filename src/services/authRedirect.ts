const POST_LOGIN_REDIRECT_PARAM = 'returnTo'
const POST_LOGIN_REDIRECT_STORAGE_KEY = 'auth.postLoginRedirect'

const isSafePostLoginRedirect = (value: string | null): value is string =>
  typeof value === 'string' &&
  value.startsWith('/') &&
  !value.startsWith('//')

const canUseSessionStorage = () =>
  typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined'

export const buildLoginPathWithRedirect = (
  loginPath: string,
  returnTo: string,
) => {
  const searchParams = new URLSearchParams()

  if (isSafePostLoginRedirect(returnTo)) {
    searchParams.set(POST_LOGIN_REDIRECT_PARAM, returnTo)
  }

  const search = searchParams.toString()
  return search ? `${loginPath}?${search}` : loginPath
}

export const getPostLoginRedirectFromSearchParams = (
  searchParams: URLSearchParams,
) => {
  const returnTo = searchParams.get(POST_LOGIN_REDIRECT_PARAM)
  return isSafePostLoginRedirect(returnTo) ? returnTo : null
}

export const setStoredPostLoginRedirect = (returnTo: string) => {
  if (!canUseSessionStorage()) {
    return
  }

  if (!isSafePostLoginRedirect(returnTo)) {
    window.sessionStorage.removeItem(POST_LOGIN_REDIRECT_STORAGE_KEY)
    return
  }

  window.sessionStorage.setItem(POST_LOGIN_REDIRECT_STORAGE_KEY, returnTo)
}

export const getStoredPostLoginRedirect = () => {
  if (!canUseSessionStorage()) {
    return null
  }

  const returnTo = window.sessionStorage.getItem(POST_LOGIN_REDIRECT_STORAGE_KEY)
  return isSafePostLoginRedirect(returnTo) ? returnTo : null
}

export const clearStoredPostLoginRedirect = () => {
  if (!canUseSessionStorage()) {
    return
  }

  window.sessionStorage.removeItem(POST_LOGIN_REDIRECT_STORAGE_KEY)
}

export const consumeStoredPostLoginRedirect = () => {
  const returnTo = getStoredPostLoginRedirect()
  clearStoredPostLoginRedirect()
  return returnTo
}
