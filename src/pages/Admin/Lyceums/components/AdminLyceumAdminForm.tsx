import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import type { AppError } from '../../../../types/appError'
import { useAdminUsers } from '../hooks/useAdminUsers'
import {
  getAdminLyceumAdminSchema,
  type AdminLyceumAdminFormValues,
} from '../validations/adminLyceumAdminSchema'

const MAX_SUGGESTIONS = 8

type AdminLyceumAdminFormProps = {
  lyceumId: number
  isOpen: boolean
  isAssigning: boolean
  assignError: AppError | null
  onAssign: (lyceumId: number, userId: number) => Promise<boolean>
}

export const AdminLyceumAdminForm = ({
  lyceumId,
  isOpen,
  isAssigning,
  assignError,
  onAssign,
}: AdminLyceumAdminFormProps) => {
  const { t } = useTranslation()
  const schema = useMemo(() => getAdminLyceumAdminSchema(t), [t])
  const usersQuery = useAdminUsers({ enabled: isOpen })

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<AdminLyceumAdminFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
    },
  })

  useEffect(() => {
    if (isOpen) return
    reset()
  }, [isOpen, reset])

  const emailValue = watch('email')
  const trimmedEmailValue = emailValue?.trim().toLowerCase() ?? ''

  const suggestions = useMemo(() => {
    const users = usersQuery.data ?? []
    const emails = users
      .map((user) => user.email)
      .filter((email): email is string => Boolean(email))
    const filtered = trimmedEmailValue
      ? emails.filter((email) =>
          email.toLowerCase().includes(trimmedEmailValue),
        )
      : emails
    return Array.from(new Set(filtered)).slice(0, MAX_SUGGESTIONS)
  }, [trimmedEmailValue, usersQuery.data])

  const suggestionMessage = usersQuery.isLoading
    ? t('pages.admin.lyceums.admins.suggestions.loading')
    : usersQuery.error
      ? t('pages.admin.lyceums.admins.suggestions.error')
      : !trimmedEmailValue
        ? t('pages.admin.lyceums.admins.suggestions.hint')
        : suggestions.length === 0
          ? t('pages.admin.lyceums.admins.suggestions.empty')
          : null

  const suggestionMessageTone = usersQuery.error
    ? 'text-rose-600'
    : suggestions.length === 0
      ? 'text-amber-700'
      : 'text-slate-500'

  const onSubmit = async (values: AdminLyceumAdminFormValues) => {
    const normalizedEmail = values.email.trim().toLowerCase()
    const users = usersQuery.data ?? []
    const matchedUser = users.find(
      (user) => user.email?.toLowerCase() === normalizedEmail,
    )
    if (!matchedUser?.id) {
      setError('email', {
        type: 'validate',
        message: t('errors.lyceums.admins.emailNotFound'),
      })
      return
    }

    const didAssign = await onAssign(lyceumId, matchedUser.id)
    if (didAssign) {
      reset()
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4">
      <h4 className="text-sm font-semibold text-slate-900">
        {t('pages.admin.lyceums.admins.form.title')}
      </h4>
      <p className="mt-1 text-sm text-slate-600">
        {t('pages.admin.lyceums.admins.form.subtitle')}
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 space-y-3"
        aria-busy={isAssigning}
      >
        <div>
          <label
            htmlFor="admin-lyceum-email"
            className="text-sm font-semibold text-slate-800"
          >
            {t('pages.admin.lyceums.admins.form.emailLabel')}
          </label>
          <input
            id="admin-lyceum-email"
            type="email"
            autoComplete="email"
            list="admin-lyceum-suggestions"
            placeholder={t(
              'pages.admin.lyceums.admins.form.emailPlaceholder',
            )}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={
              errors.email ? 'admin-lyceum-email-error' : undefined
            }
            disabled={isAssigning}
            className={[
              'mt-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
              'disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400',
              errors.email
                ? 'border-rose-300 bg-rose-50/40 focus-visible:outline-rose-300'
                : 'border-slate-200/80 bg-white',
            ].join(' ')}
            {...register('email')}
          />
          <datalist id="admin-lyceum-suggestions">
            {suggestions.map((email) => (
              <option key={email} value={email} />
            ))}
          </datalist>
          {errors.email ? (
            <p
              id="admin-lyceum-email-error"
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
        {assignError ? (
          <div
            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
            role="alert"
          >
            {t(assignError.messageKey)}
          </div>
        ) : null}
        <button
          type="submit"
          disabled={isAssigning}
          className="inline-flex w-full items-center justify-center rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isAssigning
            ? t('pages.admin.lyceums.admins.form.submitting')
            : t('pages.admin.lyceums.admins.form.submit')}
        </button>
      </form>
    </div>
  )
}
