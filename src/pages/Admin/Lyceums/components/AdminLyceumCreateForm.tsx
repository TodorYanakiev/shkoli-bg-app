import type { BaseSyntheticEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'

import type { AppError } from '../../../../types/appError'
import { LYCEUM_TOWNS } from '../../../../constants/lyceums'
import type { AdminLyceumCreateFormValues } from '../validations/adminLyceumCreateSchema'

const fieldOrder = [
  'name',
  'town',
  'region',
  'municipality',
  'address',
  'email',
  'phone',
  'status',
  'bulstat',
  'registrationNumber',
  'latitude',
  'longitude',
  'chairman',
  'secretary',
  'chitalishtaUrl',
  'urlToLibrariesSite',
] as const

type LyceumCreateFieldName = (typeof fieldOrder)[number]

const requiredFields = new Set<LyceumCreateFieldName>(['name', 'town'])
const numberFields = new Set<LyceumCreateFieldName>([
  'registrationNumber',
  'latitude',
  'longitude',
])
const selectFields = new Set<LyceumCreateFieldName>(['town', 'region'])
const wideFields = new Set<LyceumCreateFieldName>([
  'address',
  'chitalishtaUrl',
  'urlToLibrariesSite',
])

const getInputType = (fieldName: LyceumCreateFieldName) => {
  if (fieldName === 'email') return 'email'
  return 'text'
}

const getInputMode = (
  fieldName: LyceumCreateFieldName,
): 'text' | 'decimal' => (numberFields.has(fieldName) ? 'decimal' : 'text')

const getFieldErrorMessage = (
  errors: FieldErrors<AdminLyceumCreateFormValues>,
  fieldName: LyceumCreateFieldName,
) => {
  const message = errors[fieldName]?.message
  return typeof message === 'string' ? message : null
}

type AdminLyceumCreateFormProps = {
  register: UseFormRegister<AdminLyceumCreateFormValues>
  errors: FieldErrors<AdminLyceumCreateFormValues>
  isSubmitting: boolean
  submitError: AppError | null
  onCancel: () => void
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>
}

export const AdminLyceumCreateForm = ({
  register,
  errors,
  isSubmitting,
  submitError,
  onCancel,
  onSubmit,
}: AdminLyceumCreateFormProps) => {
  const { t } = useTranslation()

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3">
      <p className="text-xs font-semibold text-slate-500">{t('form.requiredLabel')}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {fieldOrder.map((fieldName) => {
          const isRequired = requiredFields.has(fieldName)
          const fieldErrorMessage = getFieldErrorMessage(errors, fieldName)
          const inputType = getInputType(fieldName)
          const inputMode = getInputMode(fieldName)
          return (
            <label
              key={fieldName}
              className={`space-y-1 text-sm text-slate-700 ${
                wideFields.has(fieldName) ? 'sm:col-span-2' : ''
              }`}
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {t(`pages.admin.lyceums.create.fields.${fieldName}`)}
                {isRequired ? (
                  <span className="ml-1 text-rose-600" aria-hidden="true">
                    *
                  </span>
                ) : null}
              </span>
              {selectFields.has(fieldName) ? (
                <select
                  {...register(fieldName)}
                  required={isRequired}
                  disabled={isSubmitting}
                  className={[
                    'h-11 w-full rounded-xl border px-3 text-sm text-slate-900 outline-none transition',
                    'focus:border-brand/60 focus:ring-2 focus:ring-brand/20',
                    fieldErrorMessage
                      ? 'border-rose-300 bg-rose-50/30'
                      : 'border-slate-300 bg-white',
                  ].join(' ')}
                >
                  <option value="">
                    {t('pages.admin.lyceums.create.selectPlaceholder')}
                  </option>
                  {LYCEUM_TOWNS.map((townOption) => (
                    <option key={townOption} value={townOption}>
                      {townOption}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={inputType}
                  inputMode={inputMode}
                  {...register(fieldName)}
                  required={isRequired}
                  disabled={isSubmitting}
                  className={[
                    'h-11 w-full rounded-xl border px-3 text-sm text-slate-900 outline-none transition',
                    'focus:border-brand/60 focus:ring-2 focus:ring-brand/20',
                    fieldErrorMessage
                      ? 'border-rose-300 bg-rose-50/30'
                      : 'border-slate-300 bg-white',
                  ].join(' ')}
                />
              )}
              {fieldErrorMessage ? (
                <p className="text-xs text-rose-600" role="alert">
                  {fieldErrorMessage}
                </p>
              ) : null}
            </label>
          )
        })}
      </div>

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
          onClick={onCancel}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {t('pages.admin.lyceums.create.cancel')}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isSubmitting
            ? t('pages.admin.lyceums.create.submitting')
            : t('pages.admin.lyceums.create.submit')}
        </button>
      </div>
    </form>
  )
}
