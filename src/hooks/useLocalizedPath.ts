import { useCallback } from 'react'

import { useCurrentLocale } from './useCurrentLocale'
import { toLocalizedPath } from '../utils/localizedPath'

export const useLocalizedPath = () => {
  const locale = useCurrentLocale()

  return useCallback(
    (pathname: string) => toLocalizedPath(pathname, locale),
    [locale],
  )
}

