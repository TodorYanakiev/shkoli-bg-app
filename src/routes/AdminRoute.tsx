import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate } from 'react-router-dom'

import { useCurrentLocale } from '../hooks/useCurrentLocale'
import { useAuthStatus } from '../hooks/useAuthStatus'
import { useUserProfile } from '../pages/Profile/hooks/useUserProfile'
import { getProfileErrorKey } from '../pages/Profile/services/profileErrors'
import { toLocalizedPath } from '../utils/localizedPath'

type AdminRouteProps = {
  children: ReactNode
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { t } = useTranslation()
  const locale = useCurrentLocale()
  const { isAuthenticated } = useAuthStatus()
  const {
    data: user,
    isLoading,
    error,
  } = useUserProfile({ enabled: isAuthenticated })

  if (!isAuthenticated) {
    return <Navigate to={toLocalizedPath('/auth/login', locale)} replace />
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
        {t('pages.admin.loading')}
      </div>
    )
  }

  if (error) {
    const errorKey = getProfileErrorKey(error ?? null)
    const errorMessage = errorKey ? t(errorKey) : t('errors.generic')
    return (
      <div
        className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm"
        role="alert"
      >
        {errorMessage}
      </div>
    )
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
        {t('pages.admin.empty')}
      </div>
    )
  }

  if (user.role !== 'ADMIN') {
    return <Navigate to={toLocalizedPath('/shkoli', locale)} replace />
  }

  return <>{children}</>
}

export default AdminRoute
