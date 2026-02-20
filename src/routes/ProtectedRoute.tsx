import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { useCurrentLocale } from '../hooks/useCurrentLocale'
import { useAuthStatus } from '../hooks/useAuthStatus'
import { toLocalizedPath } from '../utils/localizedPath'

type ProtectedRouteProps = {
  children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuthStatus()
  const locale = useCurrentLocale()

  if (!isAuthenticated) {
    return <Navigate to={toLocalizedPath('/auth/login', locale)} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
