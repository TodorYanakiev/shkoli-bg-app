import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'

import { useToast } from '../../../../components/feedback/ToastContext'
import type { ApiError } from '../../../../types/api'
import type { UserResponse } from '../../../../types/users'
import { getUserDisplayName } from '../../../../utils/user'
import {
  getLyceumLecturerSchema,
  type LyceumLecturerFormValues,
} from '../../../../validations/lyceums'
import {
  lyceumLecturersQueryKey,
  useLyceumLecturers,
} from '../../hooks/useLyceumLecturers'
import { useUsers } from '../../hooks/useUsers'
import { useAddLyceumLecturerMutation } from '../../hooks/useAddLyceumLecturerMutation'
import { useRemoveLyceumLecturerMutation } from '../../hooks/useRemoveLyceumLecturerMutation'

const MAX_SUGGESTIONS = 8

const getAddLecturerErrorMessage = (
  error: ApiError | null,
  t: (key: string) => string,
) => {
  if (!error) return null
  if (error.kind === 'network') {
    return t('errors.network')
  }
  if (error.kind === 'unauthorized' || error.kind === 'forbidden') {
    return t('errors.auth.forbidden')
  }
  if (error.status === 409) {
    return t('errors.lyceums.lecturers.alreadyAssigned')
  }
  if (error.status === 404) {
    return t('errors.lyceums.lecturers.notFound')
  }
  if (error.status === 400) {
    return t('errors.lyceums.lecturers.addInvalid')
  }
  if (error.status >= 500) {
    return t('errors.generic')
  }
  return t('errors.lyceums.lecturers.addFailed')
}

const getRemoveLecturerErrorMessage = (
  error: ApiError | null,
  t: (key: string) => string,
) => {
  if (!error) return null
  if (error.kind === 'network') {
    return t('errors.network')
  }
  if (error.kind === 'unauthorized' || error.kind === 'forbidden') {
    return t('errors.auth.forbidden')
  }
  if (error.status === 404) {
    return t('errors.lyceums.lecturers.notFound')
  }
  if (error.status === 400) {
    return t('errors.lyceums.lecturers.removeInvalid')
  }
  if (error.status >= 500) {
    return t('errors.generic')
  }
  return t('errors.lyceums.lecturers.removeFailed')
}

const getLecturersLoadErrorMessage = (
  error: ApiError | null,
  t: (key: string) => string,
) => {
  if (!error) return null
  if (error.kind === 'network') {
    return t('errors.network')
  }
  if (error.kind === 'unauthorized' || error.kind === 'forbidden') {
    return t('errors.auth.forbidden')
  }
  return t('pages.lyceums.edit.lecturers.listError')
}

type LyceumLecturerManagerProps = {
  lyceumId: number
}

const LyceumLecturerManager = ({ lyceumId }: LyceumLecturerManagerProps) => {
  const { t } = useTranslation()
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  const schema = useMemo(() => getLyceumLecturerSchema(t), [t])
  const [removingId, setRemovingId] = useState<number | null>(null)
  const [manualErrorEmail, setManualErrorEmail] = useState<string | null>(null)
  const [confirmingId, setConfirmingId] = useState<number | null>(null)

  const {
    data: lecturers,
    isLoading: isLecturersLoading,
    error: lecturersError,
  } = useLyceumLecturers(lyceumId, { enabled: Number.isFinite(lyceumId) })
  const {
    data: users,
    isLoading: isUsersLoading,
    error: usersError,
  } = useUsers({ enabled: Number.isFinite(lyceumId) })

  const addMutation = useAddLyceumLecturerMutation()
  const removeMutation = useRemoveLyceumLecturerMutation()

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    reset,
    formState: { errors },
  } = useForm<LyceumLecturerFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
    },
  })

  const emailValue = watch('email')
  const trimmedEmailValue = emailValue?.trim().toLowerCase() ?? ''

  useEffect(() => {
    if (!manualErrorEmail) return
    if (trimmedEmailValue !== manualErrorEmail) {
      clearErrors('email')
      setManualErrorEmail(null)
    }
  }, [manualErrorEmail, trimmedEmailValue, clearErrors])

  const usersByEmail = useMemo(() => {
    if (!users) {
      return new Map<string, UserResponse>()
    }
    return new Map(
      users
        .filter((user) => Boolean(user.email))
        .map((user) => [user.email?.toLowerCase() ?? '', user]),
    )
  }, [users])

  const suggestionEmails = useMemo(() => {
    if (!users) {
      return []
    }
    const emails = users
      .map((user) => user.email)
      .filter((email): email is string => Boolean(email))
    const filtered = trimmedEmailValue
      ? emails.filter((email) =>
          email.toLowerCase().includes(trimmedEmailValue),
        )
      : emails
    const uniqueEmails = Array.from(new Set(filtered))
    return uniqueEmails.slice(0, MAX_SUGGESTIONS)
  }, [users, trimmedEmailValue])

  const onAddSubmit = (values: LyceumLecturerFormValues) => {
    const normalizedEmail = values.email.trim().toLowerCase()
    const matchedUser = usersByEmail.get(normalizedEmail)

    if (!matchedUser?.id) {
      setError('email', {
        type: 'manual',
        message: t('errors.lyceums.lecturers.emailNotFound'),
      })
      setManualErrorEmail(normalizedEmail)
      return
    }

    const userId = matchedUser.id
    addMutation.reset()
    addMutation.mutate(
      { userId, lyceumId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: lyceumLecturersQueryKey(lyceumId),
          })
          reset()
          showToast({
            message: t('feedback.lyceums.lecturerAdded'),
            tone: 'success',
          })
        },
      },
    )
  }

  const onRemove = (userId?: number) => {
    if (!userId) return
    removeMutation.reset()
    setRemovingId(userId)
    removeMutation.mutate(
      { lyceumId, userId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: lyceumLecturersQueryKey(lyceumId),
          })
          setRemovingId(null)
          showToast({
            message: t('feedback.lyceums.lecturerRemoved'),
            tone: 'success',
          })
        },
        onError: () => {
          setRemovingId(null)
        },
      },
    )
  }

  const addErrorMessage = getAddLecturerErrorMessage(
    addMutation.error ?? null,
    t,
  )
  const removeErrorMessage = getRemoveLecturerErrorMessage(
    removeMutation.error ?? null,
    t,
  )
  const lecturersLoadErrorMessage = getLecturersLoadErrorMessage(
    lecturersError ?? null,
    t,
  )
  const lecturersCount = lecturers?.length ?? 0
  const fallbackValue = t('pages.lyceums.detail.notProvided')
  const usersCount = users?.length ?? 0

  const suggestionMessage = useMemo(() => {
    if (isUsersLoading) {
      return t('pages.lyceums.edit.lecturers.suggestions.loading')
    }
    if (usersError) {
      return t('pages.lyceums.edit.lecturers.suggestions.error')
    }
    if (!trimmedEmailValue) {
      return t('pages.lyceums.edit.lecturers.suggestions.hint')
    }
    if (usersCount === 0 || suggestionEmails.length === 0) {
      return t('pages.lyceums.edit.lecturers.suggestions.empty')
    }
    return null
  }, [
    isUsersLoading,
    usersError,
    trimmedEmailValue,
    usersCount,
    suggestionEmails.length,
    t,
  ])

  const suggestionMessageTone = usersError
    ? 'text-rose-600'
    : usersCount === 0 || suggestionEmails.length === 0
      ? 'text-amber-700'
      : 'text-slate-500'

  const inputClassName = (hasError: boolean) =>
    [
      'mt-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400',
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
      'disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400',
      hasError
        ? 'border-rose-300 bg-rose-50/40 focus-visible:outline-rose-300'
        : 'border-slate-200/80 bg-white',
    ].join(' ')

  const actionButtonClassName =
    'inline-flex w-full items-center justify-center rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300'

  const removeButtonClassName =
    'inline-flex items-center justify-center rounded-full border border-rose-200 bg-white px-3 py-1 text-[10px] font-semibold text-rose-600 shadow-sm transition hover:border-rose-300 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-60'
  const confirmButtonClassName =
    'inline-flex items-center justify-center rounded-full bg-rose-600 px-3 py-1 text-[10px] font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-300'
  const cancelButtonClassName =
    'inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-60'

  const isAddDisabled =
    addMutation.isPending || isUsersLoading || Boolean(usersError)

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-sm backdrop-blur sm:p-7">
      <div className="pointer-events-none absolute -top-10 right-6 h-24 w-24 rounded-full bg-brand/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-28 w-28 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="relative z-10 space-y-4">
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
            {t('pages.lyceums.detail.countLabel', { count: lecturersCount })}
          </span>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">
              {t('pages.lyceums.edit.lecturers.addTitle')}
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {t('pages.lyceums.edit.lecturers.addDescription')}
            </p>
            <form
              onSubmit={handleSubmit(onAddSubmit)}
              className="mt-4 space-y-3"
              aria-busy={addMutation.isPending}
            >
              <div>
                <label
                  htmlFor="lyceum-lecturer-email"
                  className="text-sm font-semibold text-slate-800"
                >
                  {t('pages.lyceums.edit.lecturers.form.emailLabel')}
                </label>
                <input
                  id="lyceum-lecturer-email"
                  type="email"
                  autoComplete="email"
                  list="lyceum-lecturer-suggestions"
                  placeholder={t(
                    'pages.lyceums.edit.lecturers.form.emailPlaceholder',
                  )}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? 'lyceum-lecturer-email-error' : undefined
                  }
                  disabled={isAddDisabled}
                  className={`${inputClassName(Boolean(errors.email))} hide-datalist-indicator`}
                  {...register('email')}
                />
                <datalist id="lyceum-lecturer-suggestions">
                  {suggestionEmails.map((email) => (
                    <option key={email} value={email} />
                  ))}
                </datalist>
                {errors.email ? (
                  <p
                    id="lyceum-lecturer-email-error"
                    className="mt-1 text-xs text-rose-600"
                    role="alert"
                  >
                    {errors.email.message}
                  </p>
                ) : null}
                {suggestionMessage ? (
                  <p className={`mt-2 text-xs ${suggestionMessageTone}`}>
                    {suggestionMessage}
                  </p>
                ) : null}
              </div>
              {addErrorMessage ? (
                <div
                  className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
                  role="alert"
                >
                  {addErrorMessage}
                </div>
              ) : null}
              <button
                type="submit"
                disabled={isAddDisabled}
                className={actionButtonClassName}
              >
                {addMutation.isPending
                  ? t('pages.lyceums.edit.lecturers.form.submitting')
                  : t('pages.lyceums.edit.lecturers.form.submit')}
              </button>
            </form>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">
              {t('pages.lyceums.edit.lecturers.listTitle')}
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {t('pages.lyceums.edit.lecturers.listDescription')}
            </p>
            {isLecturersLoading ? (
              <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-600">
                {t('pages.lyceums.edit.lecturers.loading')}
              </div>
            ) : lecturersLoadErrorMessage ? (
              <div
                className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-4 text-sm text-rose-700"
                role="alert"
              >
                {lecturersLoadErrorMessage}
              </div>
            ) : lecturers && lecturers.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {lecturers.map((lecturer, index) => {
                  const displayName =
                    getUserDisplayName(lecturer) || fallbackValue
                  const email = lecturer.email ?? fallbackValue
                  const lecturerId = lecturer.id
                  const isRemoving =
                    removeMutation.isPending && removingId === lecturerId
                  const isConfirming = confirmingId === lecturerId
                  const isRemoveDisabled =
                    removeMutation.isPending || !lecturerId
                  return (
                    <li
                      key={lecturer.id ?? `${displayName}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-white px-3 py-2 text-sm shadow-sm"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900">
                          {displayName}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {email}
                        </p>
                      </div>
                      {isConfirming ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold text-rose-600">
                            {t('pages.lyceums.edit.lecturers.confirmPrompt')}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setConfirmingId(null)
                              onRemove(lecturerId)
                            }}
                            disabled={isRemoveDisabled}
                            className={confirmButtonClassName}
                          >
                            {isRemoving
                              ? t('pages.lyceums.edit.lecturers.removing')
                              : t('pages.lyceums.edit.lecturers.confirmAction')}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmingId(null)}
                            disabled={isRemoveDisabled}
                            className={cancelButtonClassName}
                          >
                            {t('pages.lyceums.edit.lecturers.cancelAction')}
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmingId(lecturerId ?? null)}
                          disabled={isRemoveDisabled}
                          className={removeButtonClassName}
                          aria-label={t(
                            'pages.lyceums.edit.lecturers.removeLabel',
                            {
                              name: displayName,
                            },
                          )}
                          title={t('pages.lyceums.edit.lecturers.removeLabel', {
                            name: displayName,
                          })}
                        >
                          {t('pages.lyceums.edit.lecturers.removeAction')}
                        </button>
                      )}
                    </li>
                  )
                })}
              </ul>
            ) : (
              <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-600">
                {t('pages.lyceums.edit.lecturers.empty')}
              </div>
            )}
            {removeErrorMessage ? (
              <div
                className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
                role="alert"
              >
                {removeErrorMessage}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LyceumLecturerManager
