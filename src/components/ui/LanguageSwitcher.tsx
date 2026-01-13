import { useTranslation } from 'react-i18next'

import {
  defaultLanguage,
  isSupportedLanguage,
  supportedLanguages,
} from '../../utils/language'
import type { LanguageCode } from '../../utils/language'

const joinClasses = (...entries: Array<string | undefined>) =>
  entries.filter(Boolean).join(' ')

const languageMeta: Record<
  LanguageCode,
  { flag: string; abbr: string; labelKey: string }
> = {
  bg: {
    flag: '🇧🇬',
    abbr: 'BG',
    labelKey: 'layouts.app.nav.languageSwitch.options.bg',
  },
  en: {
    flag: '🇬🇧',
    abbr: 'EN',
    labelKey: 'layouts.app.nav.languageSwitch.options.en',
  },
}

const LanguageSwitcher = ({ className }: { className?: string }) => {
  const { t, i18n } = useTranslation()
  const currentLanguage: LanguageCode = isSupportedLanguage(i18n.language)
    ? i18n.language
    : defaultLanguage
  const currentMetadata = languageMeta[currentLanguage]
  const nextLanguage =
    supportedLanguages[
      (supportedLanguages.indexOf(currentLanguage) + 1) %
        supportedLanguages.length
    ]
  const nextLabel = t(languageMeta[nextLanguage].labelKey)

  const handleToggle = () => {
    void i18n.changeLanguage(nextLanguage)
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={t('layouts.app.nav.languageSwitch.switchTo', {
        language: nextLabel,
      })}
      title={t('layouts.app.nav.languageSwitch.switchTo', {
        language: nextLabel,
      })}
      className={joinClasses(
        'flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
        className,
      )}
    >
      <span>{currentMetadata.abbr}</span>
    </button>
  )
}

export default LanguageSwitcher
