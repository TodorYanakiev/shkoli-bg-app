import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

import {
  defaultLanguage,
  isSupportedLanguage,
  supportedLanguages,
} from '../../utils/language'
import type { LanguageCode } from '../../utils/language'
import { stripLocalePrefix, toLocalizedPath } from '../../utils/localizedPath'

const joinClasses = (...entries: Array<string | undefined>) =>
  entries.filter(Boolean).join(' ')

const languageMeta: Record<LanguageCode, { abbr: string; labelKey: string }> = {
  bg: {
    abbr: 'BG',
    labelKey: 'layouts.app.nav.languageSwitch.options.bg',
  },
  en: {
    abbr: 'EN',
    labelKey: 'layouts.app.nav.languageSwitch.options.en',
  },
}

const LanguageSwitcher = ({ className }: { className?: string }) => {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const currentLanguage: LanguageCode = isSupportedLanguage(i18n.language)
    ? i18n.language
    : defaultLanguage
  const pathWithoutLocale = stripLocalePrefix(location.pathname)

  return (
    <nav
      aria-label={t('layouts.app.nav.languageSwitch.label')}
      className={joinClasses('flex items-center gap-1', className)}
    >
      {supportedLanguages.map((language) => {
        const metadata = languageMeta[language]
        const isCurrent = language === currentLanguage
        const destination = `${toLocalizedPath(pathWithoutLocale, language)}${location.search}${location.hash}`

        return (
          <Link
            key={language}
            to={destination}
            hrefLang={language}
            aria-current={isCurrent ? 'true' : undefined}
            aria-label={t('layouts.app.nav.languageSwitch.switchTo', {
              language: t(metadata.labelKey),
            })}
            className={joinClasses(
              'rounded-full border px-3 py-1 text-xs font-semibold shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
              isCurrent
                ? 'border-brand/30 bg-brand/10 text-brand-dark'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900',
            )}
          >
            {metadata.abbr}
          </Link>
        )
      })}
    </nav>
  )
}

export default LanguageSwitcher