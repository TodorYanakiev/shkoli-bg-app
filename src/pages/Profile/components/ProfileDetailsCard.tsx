import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

type ProfileDetailsCardProps = {
  fullName: string
  username: string
  email: string
  description: string
}

const ProfileDetailsCard = ({
  fullName,
  username,
  email,
  description,
}: ProfileDetailsCardProps) => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const shouldClampDescription = useMemo(
    () => description.trim().length > 220,
    [description],
  )
  const descriptionClassName = [
    'font-medium text-slate-900 whitespace-pre-wrap break-words',
    shouldClampDescription && !isExpanded ? 'max-h-24 overflow-hidden' : '',
  ]
    .join(' ')
    .trim()

  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white/85 p-5 shadow-sm backdrop-blur sm:p-6">
      <h2 className="text-xl font-semibold text-slate-900">
        {t('pages.profile.details.title')}
      </h2>
      <dl className="mt-5 grid gap-y-4 text-sm sm:grid-cols-[minmax(0,180px)_minmax(0,1fr)] sm:gap-x-6">
        <div className="sm:contents">
          <dt className="text-slate-500">
            {t('pages.profile.details.fullName')}
          </dt>
          <dd className="break-words font-medium text-slate-900 sm:text-right">
            {fullName}
          </dd>
        </div>
        <div className="sm:contents">
          <dt className="text-slate-500">
            {t('pages.profile.details.username')}
          </dt>
          <dd className="break-words font-medium text-slate-900 sm:text-right">
            {username}
          </dd>
        </div>
        <div className="sm:contents">
          <dt className="text-slate-500">
            {t('pages.profile.details.email')}
          </dt>
          <dd className="break-words font-medium text-slate-900 sm:text-right">
            {email}
          </dd>
        </div>
        <div className="sm:contents">
          <dt className="text-slate-500">
            {t('pages.profile.details.description')}
          </dt>
          <dd className={descriptionClassName}>
            {description}
            {shouldClampDescription ? (
              <button
                type="button"
                onClick={() => setIsExpanded((previous) => !previous)}
                className="mt-2 block text-xs font-semibold text-brand transition hover:text-brand-dark sm:ml-auto"
              >
                {isExpanded
                  ? t('pages.profile.details.showLess')
                  : t('pages.profile.details.showMore')}
              </button>
            ) : null}
          </dd>
        </div>
      </dl>
    </section>
  )
}

export default ProfileDetailsCard
