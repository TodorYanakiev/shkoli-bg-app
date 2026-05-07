import { useTranslation } from 'react-i18next'

type AdminFeedbackHeaderProps = {
  totalItems: number
  isLoading: boolean
}

export const AdminFeedbackHeader = ({
  totalItems,
  isLoading,
}: AdminFeedbackHeaderProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-slate-900">
          {t('pages.admin.feedback.title')}
        </h2>
        <p className="text-sm text-slate-600">
          {t('pages.admin.feedback.subtitle')}
        </p>
      </div>
      <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm">
        <span className="h-2 w-2 rounded-full bg-brand/60" />
        <span>
          {isLoading
            ? t('pages.admin.feedback.loading')
            : t('pages.admin.feedback.countLabel', {
                count: totalItems,
              })}
        </span>
      </div>
    </div>
  )
}
