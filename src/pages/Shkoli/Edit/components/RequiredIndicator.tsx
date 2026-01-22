import { useTranslation } from 'react-i18next'

export const RequiredIndicator = () => {
  const { t } = useTranslation()

  return (
    <>
      <span className="ml-1 text-rose-500" aria-hidden="true">
        *
      </span>
      <span className="sr-only"> {t('form.requiredLabel')}</span>
    </>
  )
}
