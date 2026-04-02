import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { buildLoginPathWithRedirect } from '../services/authRedirect'
import { useLocalizedPath } from './useLocalizedPath'

export const useLoginRedirectToCurrentPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const localizedPath = useLocalizedPath()

  return useCallback(() => {
    const returnTo = `${location.pathname}${location.search}${location.hash}`
    const loginPath = buildLoginPathWithRedirect(
      localizedPath('/auth/login'),
      returnTo,
    )

    navigate(loginPath)
  }, [
    location.hash,
    location.pathname,
    location.search,
    localizedPath,
    navigate,
  ])
}
