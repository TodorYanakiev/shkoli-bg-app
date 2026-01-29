import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import type { LyceumResponse } from '../../../../types/lyceums'

type AdminLyceumCardProps = {
  lyceum: LyceumResponse
  onRequestDelete?: (id?: number, name?: string) => void
  isDeleting?: boolean
}

const getVerificationBadgeStyles = (
  status?: LyceumResponse['verificationStatus'],
) => {
  if (status === 'VERIFIED') {
    return 'bg-emerald-100 text-emerald-700 border-emerald-200'
  }
  if (status === 'PENDING') {
    return 'bg-amber-100 text-amber-700 border-amber-200'
  }
  if (status === 'NOT_VERIFIED') {
    return 'bg-rose-100 text-rose-700 border-rose-200'
  }
  return 'bg-slate-100 text-slate-600 border-slate-200'
}

export const AdminLyceumCard = ({
  lyceum,
  onRequestDelete,
  isDeleting = false,
}: AdminLyceumCardProps) => {
  const { t } = useTranslation()
  const fallback = t('pages.lyceums.detail.notProvided')
  const verificationLabel = lyceum.verificationStatus
    ? t(
        `pages.lyceums.detail.verificationStatus.${
          lyceum.verificationStatus
        }`,
      )
    : fallback
  const locationLabel = [lyceum.town, lyceum.municipality]
    .filter(Boolean)
    .join(', ')
  const canEdit = Boolean(lyceum.id)
  const actionBaseClassName =
    'inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold transition'
  const actionClassName = `${actionBaseClassName} border-slate-200 bg-white text-slate-600 hover:border-brand/40 hover:text-brand`
  const deleteClassName = [
    actionBaseClassName,
    'border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-300',
    isDeleting ? 'cursor-wait opacity-70' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <article className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {canEdit ? (
            <Link to={`/lyceums/${lyceum.id}/edit`} className={actionClassName}>
              {t('pages.admin.lyceums.actions.update')}
            </Link>
          ) : (
            <span
              className={`${actionClassName} cursor-not-allowed opacity-60`}
              aria-disabled="true"
            >
              {t('pages.admin.lyceums.actions.update')}
            </span>
          )}
          <button
            type="button"
            className={deleteClassName}
            onClick={() => onRequestDelete?.(lyceum.id, lyceum.name)}
            disabled={!lyceum.id || isDeleting}
          >
            {isDeleting
              ? t('pages.admin.lyceums.actions.deleting')
              : t('pages.admin.lyceums.actions.delete')}
          </button>
          <button type="button" className={actionClassName}>
            {t('pages.admin.lyceums.actions.manageAdmins')}
          </button>
        </div>
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getVerificationBadgeStyles(
            lyceum.verificationStatus,
          )}`}
        >
          {t('pages.lyceums.detail.labels.verification', {
            status: verificationLabel,
          })}
        </span>
      </div>
      <div className="mt-4 space-y-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {t('components.lyceumCard.fields.name')}
          </p>
          <h3 className="text-base font-semibold text-slate-900">
            {lyceum.name ?? fallback}
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          {locationLabel || fallback}
        </p>
      </div>
      <dl className="mt-4 space-y-3 text-xs text-slate-600">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-slate-500">
            {t('pages.lyceums.detail.fields.status')}
          </dt>
          <dd className="font-semibold text-slate-900">
            {lyceum.status ?? fallback}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-slate-500">
            {t('pages.lyceums.detail.fields.address')}
          </dt>
          <dd className="text-right font-medium text-slate-900">
            {lyceum.address ?? fallback}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-slate-500">
            {t('pages.lyceums.detail.fields.phone')}
          </dt>
          <dd className="font-medium text-slate-900">
            {lyceum.phone ?? fallback}
          </dd>
        </div>
      </dl>
      {lyceum.id ? (
        <Link
          to={`/lyceums/${lyceum.id}`}
          className="mt-4 inline-flex items-center justify-center rounded-full border border-brand/20 bg-brand/10 px-4 py-2 text-xs font-semibold text-brand transition hover:border-brand/40 hover:bg-brand/20"
        >
          {t('components.lyceumCard.viewDetails')}
        </Link>
      ) : null}
    </article>
  )
}
