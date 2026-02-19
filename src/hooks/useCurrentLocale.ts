import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import {
  defaultLanguage,
  isSupportedLanguage,
  type LanguageCode,
} from '../utils/language'

export const useCurrentLocale = (): LanguageCode => {
  const { locale } = useParams<{ locale?: string }>()

  return useMemo(
    () => (isSupportedLanguage(locale) ? locale : defaultLanguage),
    [locale],
  )
}

