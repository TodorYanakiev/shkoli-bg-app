import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import placeholderImage from '../../assets/lyceum-placeholder.svg'
import type { ApiError } from '../../types/api'
import type { LyceumResponse } from '../../types/lyceums'

type LyceumCardProps = {
  lyceum?: LyceumResponse
  isLoading?: boolean
  error?: ApiError | null
  className?: string
  imageSrc?: string
  linkTo?: string
  linkLabel?: string
}

const LyceumCard = ({
  lyceum,
  isLoading = false,
  error = null,
  className,
  imageSrc,
  linkTo,
  linkLabel,
}: LyceumCardProps) => {
  const { t } = useTranslation()
  const resolvedImage = imageSrc ?? placeholderImage
  const fallbackValue = t('components.lyceumCard.notAvailable')

  const renderContent = () => {
    if (isLoading) {
      return (
        <p className="text-sm text-slate-600">
          {t('components.lyceumCard.loading')}
        </p>
      )
    }

    if (error) {
      return (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {t('components.lyceumCard.error')}
        </p>
      )
    }

    if (!lyceum) {
      return (
        <p className="text-sm text-slate-600">
          {t('components.lyceumCard.empty')}
        </p>
      )
    }

    return (
      <dl className="space-y-3 text-sm">
        <div className="space-y-1">
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {t('components.lyceumCard.fields.name')}
          </dt>
          <dd className="text-base font-semibold text-slate-900">
            {lyceum.name ?? fallbackValue}
          </dd>
        </div>
        <div className="space-y-1">
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {t('components.lyceumCard.fields.town')}
          </dt>
          <dd className="font-medium text-slate-900">
            {lyceum.town ?? fallbackValue}
          </dd>
        </div>
        <div className="space-y-1">
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {t('components.lyceumCard.fields.address')}
          </dt>
          <dd className="font-medium text-slate-900">
            {lyceum.address ?? fallbackValue}
          </dd>
        </div>
      </dl>
    )
  }

  const classes = [
    'w-full',
    'max-w-sm',
    'rounded-lg',
    'border',
    'border-slate-200',
    'bg-white',
    'p-4',
    'shadow-sm',
    'transition',
    'hover:shadow-md',
    'hover:border-brand/50',
  ]
  if (className) {
    classes.push(className)
  }

  return (
    <div className={classes.join(' ')}>
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={resolvedImage}
          alt={t('components.lyceumCard.imageAlt')}
          className="h-32 w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="mt-4">
        <h2 className="text-sm font-semibold text-slate-900">
          {t('components.lyceumCard.title')}
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          {t('components.lyceumCard.subtitle')}
        </p>
      </div>
      <div className="mt-4">{renderContent()}</div>
      {linkTo ? (
        <Link
          to={linkTo}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand/20"
        >
          {linkLabel ?? t('components.lyceumCard.viewDetails')}
          <span aria-hidden="true">→</span>
        </Link>
      ) : null}
    </div>
  )
}

export default LyceumCard
