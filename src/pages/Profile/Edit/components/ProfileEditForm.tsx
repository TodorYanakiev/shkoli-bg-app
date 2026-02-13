import type {
  FieldErrors,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import type { UpdateUserFormValues } from '../../../../validations/users'

type ProfileEditFormProps = {
  register: UseFormRegister<UpdateUserFormValues>
  errors: FieldErrors<UpdateUserFormValues>
  isSubmitting: boolean
  updateErrorKey: string | null
  handleSubmit: UseFormHandleSubmit<UpdateUserFormValues>
  onSubmit: SubmitHandler<UpdateUserFormValues>
}

const ProfileEditForm = ({
  register,
  errors,
  isSubmitting,
  updateErrorKey,
  handleSubmit,
  onSubmit,
}: ProfileEditFormProps) => {
  const { t } = useTranslation()

  const inputClassName = (hasError: boolean, extraClasses?: string) =>
    [
      'mt-1 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 shadow-sm transition',
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
      hasError
        ? 'border-rose-300 bg-rose-50/40 focus-visible:outline-rose-300'
        : 'border-slate-200 bg-white',
      extraClasses,
    ].join(' ')

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-2xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      aria-busy={isSubmitting}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="profile-edit-firstname"
            className="text-sm font-semibold text-slate-800"
          >
            {t('pages.profile.edit.form.firstnameLabel')}
          </label>
          <input
            id="profile-edit-firstname"
            type="text"
            className={inputClassName(Boolean(errors.firstname))}
            aria-invalid={Boolean(errors.firstname)}
            {...register('firstname')}
          />
          {errors.firstname ? (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              {errors.firstname.message}
            </p>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="profile-edit-lastname"
            className="text-sm font-semibold text-slate-800"
          >
            {t('pages.profile.edit.form.lastnameLabel')}
          </label>
          <input
            id="profile-edit-lastname"
            type="text"
            className={inputClassName(Boolean(errors.lastname))}
            aria-invalid={Boolean(errors.lastname)}
            {...register('lastname')}
          />
          {errors.lastname ? (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              {errors.lastname.message}
            </p>
          ) : null}
        </div>
      </div>
      <div>
        <label
          htmlFor="profile-edit-username"
          className="text-sm font-semibold text-slate-800"
        >
          {t('pages.profile.edit.form.usernameLabel')}
        </label>
        <input
          id="profile-edit-username"
          type="text"
          className={inputClassName(Boolean(errors.username))}
          aria-invalid={Boolean(errors.username)}
          {...register('username')}
        />
        {errors.username ? (
          <p className="mt-1 text-xs text-rose-600" role="alert">
            {errors.username.message}
          </p>
        ) : null}
      </div>
      <div>
        <label
          htmlFor="profile-edit-email"
          className="text-sm font-semibold text-slate-800"
        >
          {t('pages.profile.edit.form.emailLabel')}
        </label>
        <input
          id="profile-edit-email"
          type="email"
          className={inputClassName(Boolean(errors.email))}
          aria-invalid={Boolean(errors.email)}
          {...register('email')}
        />
        {errors.email ? (
          <p className="mt-1 text-xs text-rose-600" role="alert">
            {errors.email.message}
          </p>
        ) : null}
      </div>
      <div>
        <label
          htmlFor="profile-edit-description"
          className="text-sm font-semibold text-slate-800"
        >
          {t('pages.profile.edit.form.descriptionLabel')}
        </label>
        <textarea
          id="profile-edit-description"
          rows={4}
          className={inputClassName(Boolean(errors.description), 'min-h-28')}
          aria-invalid={Boolean(errors.description)}
          {...register('description')}
        />
        {errors.description ? (
          <p className="mt-1 text-xs text-rose-600" role="alert">
            {errors.description.message}
          </p>
        ) : null}
      </div>
      {updateErrorKey ? (
        <div
          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
          role="alert"
        >
          {t(updateErrorKey)}
        </div>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {isSubmitting
          ? t('pages.profile.edit.form.submitting')
          : t('pages.profile.edit.form.submit')}
      </button>
    </form>
  )
}

export default ProfileEditForm
