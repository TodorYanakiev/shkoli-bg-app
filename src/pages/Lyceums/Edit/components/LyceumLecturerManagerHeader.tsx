import { useTranslation } from 'react-i18next'

type LyceumLecturerManagerHeaderProps = {
  count: number
}

const LyceumLecturerManagerHeader = ({
  count,
}: LyceumLecturerManagerHeaderProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div>
        <h2 className="text-base font-semibold text-slate-900">
          {t('pages.lyceums.edit.lecturers.title')}
        </h2>
        <p className="text-sm text-slate-600">
          {t('pages.lyceums.edit.lecturers.subtitle')}
        </p>
      </div>
      <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
        {t('pages.lyceums.detail.countLabel', { count })}
      </span>
    </div>
  )
}

export default LyceumLecturerManagerHeader
