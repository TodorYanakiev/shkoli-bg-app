import { useEffect, useMemo, useState } from 'react'
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
  const [isLocaleReady, setIsLocaleReady] = useState(false)
  const requiredNamespaces = useMemo(
    () =>
      requiresLegalNamespace(location.pathname)
        ? (['common', 'legal'] as const)
        : (['common'] as const),
    [location.pathname],
  )

  useEffect(() => {
    if (!isLocaleSupported || !locale) {
      return
    }

    let isCancelled = false
    setIsLocaleReady(false)

    const syncLocale = async () => {
      await ensureI18nNamespaces(locale, requiredNamespaces)

      if (i18n.language !== locale) {
        await i18n.changeLanguage(locale)
      }

      if (!isCancelled) {
        setIsLocaleReady(true)
      }
    }

    void syncLocale().catch(() => {
      if (!isCancelled) {
        setIsLocaleReady(true)
      }
    })

    return () => {
      isCancelled = true
    }
  }, [i18n, isLocaleSupported, locale, requiredNamespaces])

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

  if (!isLocaleReady) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-4 px-4 py-8 sm:px-6">
        <div className="h-7 w-2/5 animate-pulse rounded-xl bg-slate-200" />
        <div className="h-4 w-4/5 animate-pulse rounded-xl bg-slate-200" />
        <div className="h-44 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    )
  }

  return <Outlet />
}

export default LocaleRoute
