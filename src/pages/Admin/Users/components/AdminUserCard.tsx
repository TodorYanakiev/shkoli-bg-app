import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { UserResponse } from '../../../../types/users'
import { getUserDisplayName } from '../../../../utils/user'

type AdminUserCardProps = {
  user: UserResponse
  onRequestEdit?: (user: UserResponse) => void
  onRequestDelete?: (id?: number, name?: string) => void
  onManageReviews?: (
    id?: number,
    name?: string,
    averageRating?: number,
  ) => void
  isUpdating?: boolean
  isDeleting?: boolean
}

const getRoleBadgeStyles = (role?: UserResponse['role']) => {
  if (role === 'ADMIN') {
    return 'border-indigo-200 bg-indigo-100 text-indigo-700'
  }
  return 'border-slate-200 bg-slate-100 text-slate-700'
}

const getStatusBadgeStyles = (enabled?: boolean) => {
  if (enabled === false) {
    return 'border-amber-200 bg-amber-100 text-amber-800'
  }
  return 'border-emerald-200 bg-emerald-100 text-emerald-700'
}

export const AdminUserCard = ({
  user,
  onRequestEdit,
  onRequestDelete,
  onManageReviews,
  isUpdating = false,
  isDeleting = false,
}: AdminUserCardProps) => {
  const { t, i18n } = useTranslation()
  const fallback = t('pages.profile.emptyValue')
  const displayName = getUserDisplayName(user) || fallback
  const roleLabel = user.role
    ? t(`pages.admin.users.role.${user.role}`)
    : fallback
  const statusLabel =
    user.enabled === false
      ? t('pages.admin.users.status.disabled')
      : t('pages.admin.users.status.enabled')
  const administratedLyceumLabel =
    user.administratedLyceumId != null
      ? t('pages.admin.users.fields.administratedLyceumValue', {
          id: user.administratedLyceumId,
        })
      : fallback
  const ratingLabel =
    typeof user.averageRating === 'number'
      ? new Intl.NumberFormat(i18n.language, {
          maximumFractionDigits: 1,
        }).format(user.averageRating)
      : fallback
  const canEdit = Boolean(user.id)
  const actionBaseClassName =
    'inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold transition'
  const actionClassName = `${actionBaseClassName} border-slate-200 bg-white text-slate-600 hover:border-brand/40 hover:text-brand disabled:cursor-not-allowed disabled:opacity-60`
  const deleteClassName = useMemo(
    () =>
      [
        actionBaseClassName,
        'border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-300',
        isDeleting ? 'cursor-wait opacity-70' : '',
      ]
        .filter(Boolean)
        .join(' '),
    [actionBaseClassName, isDeleting],
  )

  return (
    <article className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className={actionClassName}
            onClick={() => onRequestEdit?.(user)}
            disabled={!canEdit || isUpdating || isDeleting}
          >
            {isUpdating
              ? t('pages.admin.users.actions.saving')
              : t('pages.admin.users.actions.edit')}
          </button>
          <button
            type="button"
            className={deleteClassName}
            onClick={() => onRequestDelete?.(user.id, displayName)}
            disabled={!user.id || isDeleting || isUpdating}
          >
            {isDeleting
              ? t('pages.admin.users.actions.deleting')
              : t('pages.admin.users.actions.delete')}
          </button>
          <button
            type="button"
            className={actionClassName}
            onClick={() =>
              onManageReviews?.(user.id, displayName, user.averageRating)
            }
            disabled={!user.id || isDeleting || isUpdating}
            aria-label={t('pages.admin.reviews.openReviewsFor', {
              name: displayName,
            })}
            title={t('pages.admin.reviews.openReviewsFor', { name: displayName })}
          >
            {t('pages.admin.users.actions.reviews')}
          </button>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getRoleBadgeStyles(
              user.role,
            )}`}
          >
            {roleLabel}
          </span>
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getStatusBadgeStyles(
              user.enabled,
            )}`}
          >
            {statusLabel}
          </span>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <h3 className="text-base font-semibold text-slate-900">
          {displayName}
        </h3>
        <p className="text-xs text-slate-500">
          {user.email ?? fallback}
        </p>
      </div>
      <dl className="mt-4 space-y-3 text-xs text-slate-600">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-slate-500">
            {t('pages.admin.users.fields.username')}
          </dt>
          <dd className="font-semibold text-slate-900">
            {user.username ?? fallback}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-slate-500">
            {t('pages.admin.users.fields.administratedLyceum')}
          </dt>
          <dd className="text-right font-medium text-slate-900">
            {administratedLyceumLabel}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-slate-500">
            {t('pages.admin.users.fields.averageRating')}
          </dt>
          <dd className="font-medium text-slate-900">
            {ratingLabel}
          </dd>
        </div>
      </dl>
    </article>
  )
}
