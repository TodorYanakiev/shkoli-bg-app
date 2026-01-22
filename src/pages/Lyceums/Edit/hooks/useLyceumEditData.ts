import { useUserProfile } from '../../../Profile/hooks/useUserProfile'
import { useLyceum } from '../../hooks/useLyceum'
import { getLyceumLoadError } from '../services/lyceumEditErrors'
import type { AppError } from '../../../../types/appError'
import type { LyceumResponse } from '../../../../types/lyceums'

type UseLyceumEditDataOptions = {
  lyceumId: number
  isValidId: boolean
}

type LyceumEditData = {
  lyceum?: LyceumResponse
  hasEditAccess: boolean
  isLoading: boolean
  loadError: AppError | null
}

export const useLyceumEditData = ({
  lyceumId,
  isValidId,
}: UseLyceumEditDataOptions): LyceumEditData => {
  const {
    data: lyceum,
    isLoading: isLyceumLoading,
    error: lyceumError,
  } = useLyceum(lyceumId, { enabled: isValidId })
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useUserProfile()

  const hasEditAccess =
    user?.role === 'ADMIN' || user?.administratedLyceumId === lyceumId

  const isLoading = isLyceumLoading || isUserLoading
  const loadError = getLyceumLoadError(lyceumError ?? userError ?? null)

  return {
    lyceum,
    hasEditAccess,
    isLoading,
    loadError,
  }
}
