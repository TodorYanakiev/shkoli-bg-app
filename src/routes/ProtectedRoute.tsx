import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { useAuthStatus } from '../hooks/useAuthStatus'

type ProtectedRouteProps = {
  children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuthStatus()

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
