import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import type { AppError } from '../../../types/appError'
import type { ReviewFormValues } from '../validations/reviewSchema'
import { REVIEW_RATING_OPTIONS } from '../validations/reviewSchema'

type ReviewEditorProps = {
  isAuthenticated: boolean
  hasOwnReview: boolean
  isMutating: boolean
  isDeletePending: boolean
  selectedRating: number
  actionError: AppError | null
  form: UseFormReturn<ReviewFormValues>
  onSubmit: () => void
  onDelete: () => void
}

export const ReviewEditor = ({
  isAuthenticated,
  hasOwnReview,
  isMutating,
  isDeletePending,
  selectedRating,
  actionError,
  form,
  onSubmit,
  onDelete,
}: ReviewEditorProps) => {
  const { t } = useTranslation()

  if (!isAuthenticated) {
    return (
      <p className="text-sm text-slate-600">
        {t('pages.reviews.form.authHint')}{' '}
        <Link
          to="/auth/login"
          className="font-semibold text-brand underline"
        >
          {t('pages.reviews.form.authAction')}
        </Link>
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} aria-busy={isMutating} className="space-y-3">
      <h4 className="text-sm font-semibold text-slate-900">
        {t(
          hasOwnReview
            ? 'pages.reviews.form.editTitle'
            : 'pages.reviews.form.createTitle',
        )}
      </h4>
      <div className="flex flex-wrap gap-2">
        {REVIEW_RATING_OPTIONS.map((ratingOption) => (
          <label key={ratingOption} className="cursor-pointer">
            <input
              type="radio"
              value={ratingOption}
              className="sr-only"
              {...form.register('rating')}
            />
            <span
              className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${
                selectedRating === ratingOption
                  ? 'border-amber-400 bg-amber-50 text-amber-700'
                  : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              {ratingOption}
            </span>
          </label>
        ))}
      </div>
      {form.formState.errors.rating ? (
        <p className="text-xs text-rose-600" role="alert">
          {form.formState.errors.rating.message}
        </p>
      ) : null}
      <textarea
        rows={4}
        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm"
        placeholder={t('pages.reviews.form.commentPlaceholder')}
        {...form.register('comment')}
      />
      {form.formState.errors.comment ? (
        <p className="text-xs text-rose-600" role="alert">
          {form.formState.errors.comment.message}
        </p>
      ) : null}
      {actionError ? (
        <div
          className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
          role="alert"
        >
          {t(actionError.messageKey)}
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={isMutating}
          className="inline-flex items-center rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isMutating
            ? t(
                hasOwnReview
                  ? 'pages.reviews.form.updating'
                  : 'pages.reviews.form.submitting',
              )
            : t(
                hasOwnReview
                  ? 'pages.reviews.form.update'
                  : 'pages.reviews.form.submit',
              )}
        </button>
        {hasOwnReview ? (
          <button
            type="button"
            onClick={onDelete}
            disabled={isMutating}
            className="inline-flex items-center rounded-full border border-rose-200 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeletePending
              ? t('pages.reviews.form.deleting')
              : t('pages.reviews.form.delete')}
          </button>
        ) : null}
      </div>
    </form>
  )
}
