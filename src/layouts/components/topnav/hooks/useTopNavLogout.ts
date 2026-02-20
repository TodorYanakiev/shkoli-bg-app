import type { TFunction } from 'i18next'
import { useNavigate } from 'react-router-dom'

import { useToast } from '../../../../components/feedback/ToastContext'
import { useCurrentLocale } from '../../../../hooks/useCurrentLocale'
import { useLogoutMutation } from '../../../../hooks/useLogoutMutation'
import type { ApiError } from '../../../../types/api'
import { clearTokens } from '../../../../utils/authStorage'
import { toLocalizedPath } from '../../../../utils/localizedPath'

type UseTopNavLogoutOptions = {
  t: TFunction
}

type TopNavLogoutState = {
  onLogout: () => void
  logoutErrorMessage: string | null
  isLoggingOut: boolean
}

const getLogoutErrorMessage = (
  error: ApiError | null,
  translate: (key: string) => string,
) => {
  if (!error) return null
  if (error.kind === 'unauthorized' || error.kind === 'forbidden') {
    return null
  }
  if (error.kind === 'network') {
    return translate('errors.network')
  }
  return translate('errors.auth.logoutFailed')
}

export const useTopNavLogout = ({
  t,
}: UseTopNavLogoutOptions): TopNavLogoutState => {
  const logoutMutation = useLogoutMutation()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const locale = useCurrentLocale()
  const loginPath = toLocalizedPath('/auth/login', locale)

  const onLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        clearTokens()
        showToast({
          message: t('feedback.auth.logoutSuccess'),
          tone: 'success',
        })
        navigate(loginPath, { replace: true })
      },
      onError: (error) => {
        if (error.kind === 'unauthorized' || error.kind === 'forbidden') {
          clearTokens()
          navigate(loginPath, { replace: true })
        }
      },
    })
  }

  const logoutErrorMessage = getLogoutErrorMessage(
    logoutMutation.error ?? null,
    t,
  )

  return {
    onLogout,
    logoutErrorMessage,
    isLoggingOut: logoutMutation.isPending,
  }
}
