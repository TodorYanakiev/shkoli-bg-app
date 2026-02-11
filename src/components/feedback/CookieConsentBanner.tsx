import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useCookieConsent } from '../../hooks/useCookieConsent'

type CookiePreferenceToggleProps = {
  title: string
  description: string
  checked: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
}

const CookiePreferenceToggle = ({
  title,
  description,
  checked,
  disabled = false,
  onChange,
}: CookiePreferenceToggleProps) => (
  <label
    className={`flex items-start justify-between gap-4 rounded-xl border px-4 py-3 ${
      disabled
        ? 'border-slate-200 bg-slate-50'
        : 'border-slate-300 bg-white transition-colors hover:border-brand-dark'
    }`}
  >
    <span className="min-w-0">
      <span className="block text-sm font-semibold text-slate-900">{title}</span>
      <span className="block text-xs leading-5 text-slate-600">{description}</span>
    </span>
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={(event) => onChange?.(event.target.checked)}
      className="mt-1 h-4 w-4 cursor-pointer rounded border-slate-400 text-brand-dark focus:ring-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
    />
  </label>
)

const CookieConsentBanner = () => {
  const { t } = useTranslation()
  const { hasSelection, preferences, acceptAll, rejectOptional, savePreferences } =
    useCookieConsent()
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(() => !hasSelection)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(preferences.analytics)
  const [diagnosticsEnabled, setDiagnosticsEnabled] = useState(
    preferences.diagnostics,
  )

  useEffect(() => {
    if (!hasSelection) {
      setIsPanelOpen(true)
    }

    setAnalyticsEnabled(preferences.analytics)
    setDiagnosticsEnabled(preferences.diagnostics)
  }, [
    hasSelection,
    preferences.analytics,
    preferences.diagnostics,
  ])

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
            className="mx-auto w-full max-w-5xl rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur sm:p-5"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
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
              {hasSelection ? (
                <button
                  type="button"
                  onClick={closePanel}
                  className="rounded-md px-2 py-1 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                  {t('cookiesConsent.actions.close')}
                </button>
              ) : null}
            </div>

            <div className="space-y-3">
              <CookiePreferenceToggle
                title={t('cookiesConsent.categories.necessary.title')}
                description={t('cookiesConsent.categories.necessary.description')}
                checked
                disabled
              />
              <CookiePreferenceToggle
                title={t('cookiesConsent.categories.analytics.title')}
                description={t('cookiesConsent.categories.analytics.description')}
                checked={analyticsEnabled}
                onChange={setAnalyticsEnabled}
              />
              <CookiePreferenceToggle
                title={t('cookiesConsent.categories.diagnostics.title')}
                description={t('cookiesConsent.categories.diagnostics.description')}
                checked={diagnosticsEnabled}
                onChange={setDiagnosticsEnabled}
              />
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleRejectOptional}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100"
              >
                {t('cookiesConsent.actions.rejectOptional')}
              </button>
              <button
                type="button"
                onClick={handleSavePreferences}
                className="rounded-lg border border-brand-dark px-4 py-2 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-dark/10"
              >
                {t('cookiesConsent.actions.savePreferences')}
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="rounded-lg bg-brand-dark px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-light"
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
          className="fixed bottom-3 right-3 z-[80] rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-lg transition-colors hover:border-brand-dark hover:text-brand-dark sm:bottom-4 sm:right-4"
        >
          {t('cookiesConsent.actions.manage')}
        </button>
      ) : null}
    </>
  )
}

export default CookieConsentBanner
