import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'

import { useToast } from '../../../../components/feedback/ToastContext'
import type { ApiError } from '../../../../types/api'
import {
  getLyceumLecturerSchema,
  type LyceumLecturerFormValues,
} from '../../../../validations/lyceums'
import { useInviteLyceumLecturerMutation } from '../../hooks/useInviteLyceumLecturerMutation'
import { lyceumLecturersQueryKey } from '../../hooks/useLyceumLecturers'
import { useUsers } from '../../hooks/useUsers'

const MAX_SUGGESTIONS = 8

const getInviteLecturerErrorMessage = (
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

type LyceumLecturerInviteModalProps = {
  lyceumId: number
  modalId: string
  onClose: () => void
}

const LyceumLecturerInviteModal = ({
  lyceumId,
  modalId,
  onClose,
}: LyceumLecturerInviteModalProps) => {
  const { t } = useTranslation()
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  const schema = useMemo(() => getLyceumLecturerSchema(t), [t])
  const inviteMutation = useInviteLyceumLecturerMutation()
  const { data: users, isLoading: isUsersLoading, error: usersError } = useUsers(
    { enabled: Number.isFinite(lyceumId) },
  )

  const {
    register,
    handleSubmit,
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
    if (typeof document === 'undefined') return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

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
    inviteMutation.reset()
    inviteMutation.mutate(
      { email: normalizedEmail, lyceumId },
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
          onClose()
        },
      },
    )
  }

  const inviteErrorMessage = getInviteLecturerErrorMessage(
    inviteMutation.error ?? null,
    t,
  )
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

  const isAddDisabled = inviteMutation.isPending
  const titleId = 'lyceum-invite-lecturer-title'
  const descriptionId = 'lyceum-invite-lecturer-description'

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4 py-8 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-lg"
        role="dialog"
        id={modalId}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm">
          <button
            type="button"
            onClick={onClose}
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
            {t('pages.lyceums.edit.lecturers.addTitle')}
          </h3>
          <p id={descriptionId} className="mt-1 text-sm text-slate-600">
            {t('pages.lyceums.edit.lecturers.addDescription')}
          </p>
          <form
            onSubmit={handleSubmit(onAddSubmit)}
            className="mt-4 space-y-3"
            aria-busy={inviteMutation.isPending}
          >
            <div>
              <label
                htmlFor="lyceum-invite-email"
                className="text-sm font-semibold text-slate-800"
              >
                {t('pages.lyceums.edit.lecturers.form.emailLabel')}
              </label>
              <input
                id="lyceum-invite-email"
                type="email"
                autoComplete="email"
                list="lyceum-invite-suggestions"
                placeholder={t(
                  'pages.lyceums.edit.lecturers.form.emailPlaceholder',
                )}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? 'lyceum-invite-email-error' : undefined
                }
                disabled={isAddDisabled}
                className={`${inputClassName(Boolean(errors.email))} hide-datalist-indicator`}
                autoFocus
                {...register('email')}
              />
              <datalist id="lyceum-invite-suggestions">
                {suggestionEmails.map((email) => (
                  <option key={email} value={email} />
                ))}
              </datalist>
              {errors.email ? (
                <p
                  id="lyceum-invite-email-error"
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
            {inviteErrorMessage ? (
              <div
                className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
                role="alert"
              >
                {inviteErrorMessage}
              </div>
            ) : null}
            <button
              type="submit"
              disabled={isAddDisabled}
              className={actionButtonClassName}
            >
              {inviteMutation.isPending
                ? t('pages.lyceums.edit.lecturers.form.submitting')
                : t('pages.lyceums.edit.lecturers.form.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LyceumLecturerInviteModal
