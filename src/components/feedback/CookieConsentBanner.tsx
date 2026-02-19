import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useCookieConsent } from '../../hooks/useCookieConsent'
import CookiePreferenceToggle from './CookiePreferenceToggle'
const COOKIE_ICONS = {
  main: '\u{1F36A}',
  necessary: '\u{1F512}',
  analytics: '\u{1F4CA}',
  diagnostics: '\u{1F6E0}\uFE0F',
} as const

type CookieConsentBannerProps = {
  triggerClassName?: string
}

const CookieConsentBanner = ({ triggerClassName }: CookieConsentBannerProps) => {
  const { t } = useTranslation()
  const { hasSelection, preferences, acceptAll, rejectOptional, savePreferences } = useCookieConsent()
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(() => !hasSelection)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(preferences.analytics)
  const [diagnosticsEnabled, setDiagnosticsEnabled] = useState(preferences.diagnostics)

  useEffect(() => {
    if (!hasSelection) {
      setIsPanelOpen(true)
    }
    setAnalyticsEnabled(preferences.analytics)
    setDiagnosticsEnabled(preferences.diagnostics)
  }, [hasSelection, preferences.analytics, preferences.diagnostics])

  const closePanel = () => {
    if (!hasSelection) {
      return
    }
    setAnalyticsEnabled(preferences.analytics)
    setDiagnosticsEnabled(preferences.diagnostics)
    setIsPanelOpen(false)
  }
  const openPanel = () => {
    setAnalyticsEnabled(preferences.analytics)
    setDiagnosticsEnabled(preferences.diagnostics)
    setIsPanelOpen(true)
  }
  const handleAcceptAll = () => {
    acceptAll()
    setIsPanelOpen(false)
  }
  const handleRejectOptional = () => {
    rejectOptional()
    setIsPanelOpen(false)
  }
  const handleSavePreferences = () => {
    savePreferences({
      analytics: analyticsEnabled,
      diagnostics: diagnosticsEnabled,
    })
    setIsPanelOpen(false)
  }
  return (
    <>
      {isPanelOpen ? (
        <div className="fixed inset-x-0 bottom-0 z-[90] px-3 pb-3 sm:px-4 sm:pb-4">
          <section
            role="dialog"
            aria-modal={!hasSelection}
            aria-label={t('cookiesConsent.title')}
            className="mx-auto w-full max-w-5xl rounded-3xl border border-slate-200 bg-gradient-to-br from-amber-50/95 via-white to-sky-50/90 p-4 shadow-2xl backdrop-blur sm:p-6"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="flex min-w-0 gap-3">
                <span
                  aria-hidden
                  className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-2xl border border-amber-200 bg-white text-xl shadow-sm"
                >
                  {COOKIE_ICONS.main}
                </span>
                <div className="space-y-2">
                  <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                    {t('cookiesConsent.title')}
                  </h2>
                  <p className="text-sm leading-6 text-slate-700">
                    {t('cookiesConsent.description')}
                  </p>
                  <a
                    href="/cookies"
                    className="inline-flex text-sm font-medium text-brand-dark transition-colors hover:text-brand-light"
                  >
                    {t('cookiesConsent.learnMore')}
                  </a>
                </div>
              </div>
              {hasSelection ? (
                <button
                  type="button"
                  onClick={closePanel}
                  className="rounded-md px-2 py-1 text-sm font-medium text-slate-500 transition-colors hover:bg-white hover:text-slate-700"
                >
                  {t('cookiesConsent.actions.close')}
                </button>
              ) : null}
            </div>

            <div className="space-y-3">
              <CookiePreferenceToggle
                icon={COOKIE_ICONS.necessary}
                title={t('cookiesConsent.categories.necessary.title')}
                description={t('cookiesConsent.categories.necessary.description')}
                checked
                disabled
              />
              <CookiePreferenceToggle
                icon={COOKIE_ICONS.analytics}
                title={t('cookiesConsent.categories.analytics.title')}
                description={t('cookiesConsent.categories.analytics.description')}
                checked={analyticsEnabled}
                onChange={setAnalyticsEnabled}
              />
              <CookiePreferenceToggle
                icon={COOKIE_ICONS.diagnostics}
                title={t('cookiesConsent.categories.diagnostics.title')}
                description={t('cookiesConsent.categories.diagnostics.description')}
                checked={diagnosticsEnabled}
                onChange={setDiagnosticsEnabled}
              />
            </div>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleRejectOptional}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100"
              >
                {t('cookiesConsent.actions.rejectOptional')}
              </button>
              <button
                type="button"
                onClick={handleSavePreferences}
                className="rounded-xl border border-brand-dark bg-brand-dark/5 px-4 py-2 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-dark/10"
              >
                {t('cookiesConsent.actions.savePreferences')}
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="rounded-xl bg-brand-dark px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-light"
              >
                {t('cookiesConsent.actions.acceptAll')}
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {hasSelection && !isPanelOpen ? (
        <button
          type="button"
          onClick={openPanel}
          className={[
            'rounded-sm font-medium text-slate-600 transition-colors hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2',
            triggerClassName,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {t('cookiesConsent.actions.manage')}
        </button>
      ) : null}
    </>
  )
}

export default CookieConsentBanner
