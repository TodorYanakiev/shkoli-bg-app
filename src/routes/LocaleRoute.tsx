import { useEffect, useMemo } from 'react'
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { ensureI18nNamespaces } from '../locales/i18n'
import {
  defaultLanguage,
  getPreferredLanguage,
  isSupportedLanguage,
} from '../utils/language'
import { stripLocalePrefix, toLocalizedPath } from '../utils/localizedPath'

const requiresLegalNamespace = (pathname: string) => {
  const normalizedPath = stripLocalePrefix(pathname)
  return (
    normalizedPath === '/cookies' ||
    normalizedPath === '/privacy-policy' ||
    normalizedPath === '/terms-and-conditions'
  )
}

const LocaleRoute = () => {
  const { i18n } = useTranslation()
  const location = useLocation()
  const { locale } = useParams<{ locale?: string }>()
  const isLocaleSupported = isSupportedLanguage(locale)
  const requiredNamespaces = useMemo(
    () =>
      requiresLegalNamespace(location.pathname)
        ? (['common', 'legal'] as const)
        : (['common'] as const),
    [location.pathname],
  )
  const hasRequiredNamespaces =
    isLocaleSupported && locale
      ? requiredNamespaces.every((namespace) =>
          i18n.hasResourceBundle(locale, namespace),
        )
      : true

  useEffect(() => {
    if (!isLocaleSupported || !locale) {
      return
    }

    if (i18n.language === locale && hasRequiredNamespaces) {
      return
    }

    let isCancelled = false

    const syncLocale = async () => {
      await ensureI18nNamespaces(locale, requiredNamespaces)

      if (!isCancelled && i18n.language !== locale) {
        await i18n.changeLanguage(locale)
      }
    }

    void syncLocale().catch(() => {
      // Keep rendering the current locale to avoid layout shifts.
    })

    return () => {
      isCancelled = true
    }
  }, [
    hasRequiredNamespaces,
    i18n,
    isLocaleSupported,
    locale,
    requiredNamespaces,
  ])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.pathname])

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
