import { useNavigate, type NavigateOptions } from 'react-router-dom'

import { useCurrentLocale } from './useCurrentLocale'
import { toLocalizedPath } from '../utils/localizedPath'

export const useLocalizedNavigate = () => {
  const navigate = useNavigate()
  const locale = useCurrentLocale()

  return (to: string, options?: NavigateOptions) => {
    navigate(toLocalizedPath(to, locale), options)
  }
}

