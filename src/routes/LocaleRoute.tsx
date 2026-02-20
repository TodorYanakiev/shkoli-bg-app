import { useEffect } from 'react'
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import {
  defaultLanguage,
  getPreferredLanguage,
  isSupportedLanguage,
} from '../utils/language'
import { toLocalizedPath } from '../utils/localizedPath'

const LocaleRoute = () => {
  const { i18n } = useTranslation()
  const location = useLocation()
  const { locale } = useParams<{ locale?: string }>()
  const isLocaleSupported = isSupportedLanguage(locale)

  useEffect(() => {
    if (!isLocaleSupported || !locale) {
      return
    }

    if (i18n.language === locale) {
      return
    }
    void i18n.changeLanguage(locale)
  }, [i18n, isLocaleSupported, locale])

  if (!isLocaleSupported) {
    const preferredLanguage = getPreferredLanguage() ?? defaultLanguage
    const redirectPath = toLocalizedPath(location.pathname, preferredLanguage)
    return (
      <Navigate
        to={`${redirectPath}${location.search}${location.hash}`}
        replace
      />
    )
  }

  return <Outlet />
}

export default LocaleRoute
