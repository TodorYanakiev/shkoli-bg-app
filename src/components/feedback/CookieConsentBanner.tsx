import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useCookieConsent } from '../../hooks/useCookieConsent'
const COOKIE_ICONS = {
  main: '\u{1F36A}',
} as const

type CookieConsentBannerProps = {
  triggerClassName?: string
}

const CookieConsentBanner = ({ triggerClassName }: CookieConsentBannerProps) => {
  const { t } = useTranslation()
  const { hasSelection, acceptAll, rejectOptional } = useCookieConsent()
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(() => !hasSelection)

  useEffect(() => {
    if (!hasSelection) {
      setIsPanelOpen(true)
    }
  }, [hasSelection])

  const closePanel = () => {
    if (!hasSelection) {
      return
    }
    setIsPanelOpen(false)
  }
  const openPanel = () => {
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
  return (
    <>
      {isPanelOpen ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[90] px-3 pb-3 sm:px-4 sm:pb-4">
          <section
            role="dialog"
            aria-label={t('cookiesConsent.title')}
            className="pointer-events-auto mx-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-2xl shadow-slate-950/15 backdrop-blur sm:p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 gap-3">
                <span
                  aria-hidden
                  className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-lg shadow-sm"
                >
                  {COOKIE_ICONS.main}
                </span>
                <div className="min-w-0 space-y-1">
                  <h2 className="text-sm font-semibold leading-5 text-slate-900 sm:text-base">
                    {t('cookiesConsent.title')}
                  </h2>
                  <p className="text-xs leading-5 text-slate-700 sm:text-sm">
                    {t('cookiesConsent.description')}
                  </p>
                  <a
                    href="/cookies"
                    className="inline-flex text-xs font-semibold text-brand-dark transition-colors hover:text-brand sm:text-sm"
                  >
                    {t('cookiesConsent.learnMore')}
                  </a>
                </div>
              </div>
              {hasSelection ? (
                <button
                  type="button"
                  onClick={closePanel}
                  className="rounded-md px-2 py-1 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 sm:text-sm"
                >
                  {t('cookiesConsent.actions.close')}
                </button>
              ) : null}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:justify-end">
              <button
                type="button"
                onClick={handleRejectOptional}
                className="min-h-10 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold leading-5 text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100 sm:px-4 sm:text-sm"
              >
                {t('cookiesConsent.actions.rejectOptional')}
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="min-h-10 rounded-xl bg-brand-dark px-3 py-2 text-xs font-semibold leading-5 text-white transition-colors hover:bg-brand sm:px-4 sm:text-sm"
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
