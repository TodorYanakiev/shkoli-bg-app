import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { AppError } from '../../../../types/appError'
import type { UserResponse } from '../../../../types/users'
import { useAdminUserEditForm } from '../hooks/useAdminUserEditForm'
import { getAdminUsersUpdateError } from '../services/adminUsersErrors'
import { applyAdminUserUpdateFieldErrors } from '../services/adminUserUpdateFieldErrors'
import type {
  AdminUserUpdatePayload,
  AdminUserUpdateResult,
} from '../types'

type AdminUserEditModalProps = {
  isOpen: boolean
  user: UserResponse | null
  isSubmitting: boolean
  isImageDeleting: boolean
  onConfirm: (
    payload: AdminUserUpdatePayload,
  ) => Promise<AdminUserUpdateResult>
  onDeleteProfileImage: (userId?: number) => Promise<boolean>
  onCancel: () => void
}

export const AdminUserEditModal = ({
  isOpen,
  user,
  isSubmitting,
  isImageDeleting,
  onConfirm,
  onDeleteProfileImage,
  onCancel,
}: AdminUserEditModalProps) => {
  const { t } = useTranslation()
  const [submitError, setSubmitError] = useState<AppError | null>(null)
  const [isProfileImageRemoved, setIsProfileImageRemoved] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useAdminUserEditForm({
    user,
    isOpen,
    t,
  })

  const handleCancel = useCallback(() => {
    if (isSubmitting || isImageDeleting) return
    setSubmitError(null)
    onCancel()
  }, [isImageDeleting, isSubmitting, onCancel])

  useEffect(() => {
    if (!isOpen) {
      setSubmitError(null)
      setIsProfileImageRemoved(false)
      return
    }
    setIsProfileImageRemoved(false)
    if (typeof document === 'undefined') return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCancel()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleCancel, isOpen])

  if (!isOpen || !user) return null

  const titleId = 'admin-user-edit-title'
  const descriptionId = 'admin-user-edit-description'
  const userId = user.id
  const profileImage =
    isProfileImageRemoved ? undefined : user.profileImage

  const onSubmit = handleSubmit(async (values) => {
    if (!userId || isSubmitting) return
    clearErrors()
    setSubmitError(null)

    const result = await onConfirm({
      userId,
      payload: {
        firstname: values.firstname.trim(),
        lastname: values.lastname.trim(),
        username: values.username.trim(),
        email: values.email.trim(),
        description: values.description?.trim() ?? '',
      },
      role: values.role,
      currentRole: user.role ?? 'USER',
    })

    if (result.ok) {
      onCancel()
      return
    }

    if (!result.error) return
    const hasFieldErrors = applyAdminUserUpdateFieldErrors({
      error: result.error,
      setError,
      t,
    })
    if (!hasFieldErrors) {
      setSubmitError(getAdminUsersUpdateError(result.error))
    }
  })

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4 py-8 backdrop-blur-sm"
      onClick={handleCancel}
      role="presentation"
    >
      <div
        className="w-full max-w-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative rounded-2xl border border-slate-200/70 bg-white/95 p-5 shadow-sm">
          <button
            type="button"
            onClick={handleCancel}
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
            aria-label={t('feedback.dismiss')}
            title={t('feedback.dismiss')}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12" />
              <path d="M18 6l-12 12" />
            </svg>
          </button>
          <h3 id={titleId} className="text-sm font-semibold text-slate-900">
            {t('pages.admin.users.editModal.title')}
          </h3>
          <p id={descriptionId} className="mt-1 text-sm text-slate-600">
            {t('pages.admin.users.editModal.description')}
          </p>

          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {t('pages.admin.users.editModal.profileImage.label')}
                </p>
                <button
                  type="button"
                  onClick={async () => {
                    if (!profileImage) return
                    const deleted = await onDeleteProfileImage(userId)
                    if (deleted) {
                      setIsProfileImageRemoved(true)
                    }
                  }}
                  disabled={!profileImage || isSubmitting || isImageDeleting}
                  className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-semibold text-rose-700 transition hover:border-rose-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isImageDeleting
                    ? t('pages.admin.users.editModal.profileImage.removing')
                    : t('pages.admin.users.editModal.profileImage.remove')}
                </button>
              </div>
              {profileImage?.url ? (
                <img
                  src={profileImage.url}
                  alt={t('pages.admin.users.editModal.profileImage.alt', {
                    name: user.username ?? t('pages.profile.unknownUser'),
                  })}
                  className="mt-3 h-20 w-20 rounded-xl border border-slate-200 object-cover"
                />
              ) : (
                <p className="mt-3 text-xs text-slate-500">
                  {t('pages.admin.users.editModal.profileImage.empty')}
                </p>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm text-slate-700">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {t('pages.admin.users.editModal.fields.firstname')}
                </span>
                <input
                  type="text"
                  {...register('firstname')}
                  disabled={isSubmitting}
                  className={[
                    'h-11 w-full rounded-xl border px-3 text-sm text-slate-900 outline-none transition',
                    'focus:border-brand/60 focus:ring-2 focus:ring-brand/20',
                    errors.firstname
                      ? 'border-rose-300 bg-rose-50/30'
                      : 'border-slate-300 bg-white',
                  ].join(' ')}
                />
                {errors.firstname ? (
                  <p className="text-xs text-rose-600" role="alert">
                    {errors.firstname.message}
                  </p>
                ) : null}
              </label>
              <label className="space-y-1 text-sm text-slate-700">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {t('pages.admin.users.editModal.fields.lastname')}
                </span>
                <input
                  type="text"
                  {...register('lastname')}
                  disabled={isSubmitting}
                  className={[
                    'h-11 w-full rounded-xl border px-3 text-sm text-slate-900 outline-none transition',
                    'focus:border-brand/60 focus:ring-2 focus:ring-brand/20',
                    errors.lastname
                      ? 'border-rose-300 bg-rose-50/30'
                      : 'border-slate-300 bg-white',
                  ].join(' ')}
                />
                {errors.lastname ? (
                  <p className="text-xs text-rose-600" role="alert">
                    {errors.lastname.message}
                  </p>
                ) : null}
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm text-slate-700">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {t('pages.admin.users.editModal.fields.username')}
                </span>
                <input
                  type="text"
                  {...register('username')}
                  disabled={isSubmitting}
                  className={[
                    'h-11 w-full rounded-xl border px-3 text-sm text-slate-900 outline-none transition',
                    'focus:border-brand/60 focus:ring-2 focus:ring-brand/20',
                    errors.username
                      ? 'border-rose-300 bg-rose-50/30'
                      : 'border-slate-300 bg-white',
                  ].join(' ')}
                />
                {errors.username ? (
                  <p className="text-xs text-rose-600" role="alert">
                    {errors.username.message}
                  </p>
                ) : null}
              </label>
              <label className="space-y-1 text-sm text-slate-700">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {t('pages.admin.users.editModal.fields.email')}
                </span>
                <input
                  type="email"
                  {...register('email')}
                  disabled={isSubmitting}
                  className={[
                    'h-11 w-full rounded-xl border px-3 text-sm text-slate-900 outline-none transition',
                    'focus:border-brand/60 focus:ring-2 focus:ring-brand/20',
                    errors.email
                      ? 'border-rose-300 bg-rose-50/30'
                      : 'border-slate-300 bg-white',
                  ].join(' ')}
                />
                {errors.email ? (
                  <p className="text-xs text-rose-600" role="alert">
                    {errors.email.message}
                  </p>
                ) : null}
              </label>
            </div>

            <label className="space-y-1 text-sm text-slate-700">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {t('pages.admin.users.editModal.fields.role')}
              </span>
              <select
                {...register('role')}
                disabled={isSubmitting}
                className={[
                  'h-11 w-full rounded-xl border px-3 text-sm text-slate-900 outline-none transition',
                  'focus:border-brand/60 focus:ring-2 focus:ring-brand/20',
                  errors.role
                    ? 'border-rose-300 bg-rose-50/30'
                    : 'border-slate-300 bg-white',
                ].join(' ')}
              >
                <option value="USER">{t('pages.admin.users.role.USER')}</option>
                <option value="ADMIN">{t('pages.admin.users.role.ADMIN')}</option>
              </select>
              {errors.role ? (
                <p className="text-xs text-rose-600" role="alert">
                  {errors.role.message}
                </p>
              ) : null}
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {t('pages.admin.users.editModal.fields.description')}
              </span>
              <textarea
                rows={3}
                {...register('description')}
                disabled={isSubmitting}
                className={[
                  'w-full rounded-xl border px-3 py-2 text-sm text-slate-900 outline-none transition',
                  'focus:border-brand/60 focus:ring-2 focus:ring-brand/20',
                  errors.description
                    ? 'border-rose-300 bg-rose-50/30'
                    : 'border-slate-300 bg-white',
                ].join(' ')}
              />
              {errors.description ? (
                <p className="text-xs text-rose-600" role="alert">
                  {errors.description.message}
                </p>
              ) : null}
            </label>

            {submitError ? (
              <div
                className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
                role="alert"
              >
                {t(submitError.messageKey)}
              </div>
            ) : null}

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {t('pages.admin.users.editModal.cancel')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isSubmitting
                  ? t('pages.admin.users.editModal.submitting')
                  : t('pages.admin.users.editModal.submit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
