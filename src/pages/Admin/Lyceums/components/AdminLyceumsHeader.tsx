import { useTranslation } from 'react-i18next'

type AdminLyceumsHeaderProps = {
  verifiedCount: number
  isLoading: boolean
  isCreateSubmitting: boolean
  onOpenCreateModal: () => void
}

export const AdminLyceumsHeader = ({
  verifiedCount,
  isLoading,
  isCreateSubmitting,
  onOpenCreateModal,
}: AdminLyceumsHeaderProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-slate-900">
          {t('pages.admin.lyceums.title')}
        </h2>
        <p className="text-sm text-slate-600">
          {t('pages.admin.lyceums.subtitle')}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-brand/60" />
          <span>
            {isLoading
              ? t('pages.admin.lyceums.loading')
              : t('pages.admin.lyceums.verifiedCountLabel', {
                  count: verifiedCount,
                })}
          </span>
        </div>
        <button
          type="button"
          onClick={onOpenCreateModal}
          disabled={isCreateSubmitting}
          className="inline-flex items-center justify-center rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isCreateSubmitting
            ? t('pages.admin.lyceums.create.submitting')
            : t('pages.admin.lyceums.create.open')}
        </button>
      </div>
    </div>
  )
}
